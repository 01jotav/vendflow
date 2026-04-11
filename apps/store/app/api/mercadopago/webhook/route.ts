import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@vendflow/database";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { createHmac } from "crypto";
import { dispatchOrderEvent } from "@/lib/webhook-dispatcher";

/**
 * Webhook do Mercado Pago.
 * Recebe notificações quando o status de um pagamento muda.
 *
 * Segurança:
 *  1. HMAC-SHA256 do header x-signature (se MP_WEBHOOK_SECRET configurado)
 *  2. storeId vem na query string (setado no checkout) → busca token O(1)
 *  3. Valida que order.storeId === config.storeId
 */

// ── Signature verification ──────────────────────────────────────────────────

function verifySignature(req: Request, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // sem secret configurado, pula verificação (dev)

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");
  if (!xSignature || !xRequestId) return false;

  // MP envia: ts=<timestamp>,v1=<hmac>
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    })
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // O dataId é o data.id do body (paymentId)
  let dataId = "";
  try {
    const parsed = JSON.parse(body);
    dataId = String(parsed?.data?.id ?? "");
  } catch {
    return false;
  }

  // MP template: id:<data.id>;request-id:<x-request-id>;ts:<ts>;
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = createHmac("sha256", secret).update(manifest).digest("hex");

  return hmac === v1;
}

// ── Webhook handler ─────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const rawBody = await req.text();

  // 1. Verificar assinatura HMAC
  if (!verifySignature(req, rawBody)) {
    console.warn("Webhook MP: assinatura inválida");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true });
  }

  // MP envia vários tipos. Só tratamos "payment".
  const type = body.type ?? body.action?.split(".")?.[0];
  const paymentId = body.data?.id ?? body.resource;
  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  // 2. Identificar a loja via query param (O(1) em vez de O(n))
  const url = new URL(req.url);
  const storeId = url.searchParams.get("storeId");

  let config = storeId
    ? await db.mercadoPagoConfig.findUnique({ where: { storeId } })
    : null;

  // Fallback para pedidos antigos que não têm storeId na URL:
  // busca via external_reference (orderId) no body
  if (!config) {
    const externalRef = body.external_reference ?? body.data?.external_reference;
    if (externalRef) {
      const order = await db.order.findUnique({
        where: { id: externalRef },
        select: { storeId: true },
      });
      if (order) {
        config = await db.mercadoPagoConfig.findUnique({ where: { storeId: order.storeId } });
      }
    }
  }

  if (!config) {
    console.warn("Webhook MP: config não encontrada para storeId", storeId);
    return NextResponse.json({ ok: true });
  }

  // 3. Buscar payment no MP com o token da loja
  let mpPayment: any;
  try {
    const client = new MercadoPagoConfig({ accessToken: config.accessToken });
    const payment = new Payment(client);
    mpPayment = await payment.get({ id: String(paymentId) });
  } catch (err) {
    console.error("Webhook MP: erro ao buscar payment", err);
    return NextResponse.json({ ok: true });
  }

  if (!mpPayment?.id) {
    console.warn("Webhook MP: payment não encontrado", paymentId);
    return NextResponse.json({ ok: true });
  }

  // 4. Identificar a order e validar ownership
  const orderId = mpPayment.external_reference ?? mpPayment.metadata?.order_id;
  if (!orderId) return NextResponse.json({ ok: true });

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, storeId: true, status: true },
  });
  if (!order || order.storeId !== config.storeId) {
    console.warn("Webhook MP: order não corresponde à loja", { orderId, storeId: config.storeId });
    return NextResponse.json({ ok: true });
  }

  // 5. Mapear status
  const mpStatus: string = mpPayment.status;
  const orderStatus: OrderStatus =
    mpStatus === "approved" ? "PAID" :
    mpStatus === "rejected" || mpStatus === "cancelled" ? "CANCELLED" :
    "PENDING";
  const paymentStatus: PaymentStatus =
    mpStatus === "approved" ? "APPROVED" :
    mpStatus === "rejected" || mpStatus === "cancelled" ? "REJECTED" :
    mpStatus === "refunded" ? "REFUNDED" :
    "PENDING";

  // 6. Atualizar order e payment
  await db.order.update({ where: { id: order.id }, data: { status: orderStatus } });
  await db.payment.updateMany({
    where: { orderId: order.id },
    data: { status: paymentStatus, externalId: String(mpPayment.id) },
  });

  // 7. Se pago (e não era antes), limpa carrinho, decrementa estoque e dispara webhook
  if (orderStatus === "PAID" && order.status !== "PAID") {
    const fullOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: { select: { name: true } } } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    if (fullOrder) {
      await db.cart.deleteMany({ where: { customerId: fullOrder.customer.id } });
      for (const item of fullOrder.items) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 8. Disparar webhook externo (fire-and-forget)
      dispatchOrderEvent(order.storeId, "order.paid", {
        orderId: order.id,
        status: "paid",
        total: fullOrder.total,
        customer: {
          name: fullOrder.customer.name,
          phone: fullOrder.customer.phone,
          email: fullOrder.customer.email,
        },
        items: fullOrder.items.map((i) => ({
          product: i.product.name,
          quantity: i.quantity,
          price: i.price,
        })),
      }).catch(() => {}); // fire-and-forget
    }
  }

  return NextResponse.json({ ok: true });
}
