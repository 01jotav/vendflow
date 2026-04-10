import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@vendflow/database";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * Webhook do Mercado Pago.
 * Recebe notificações quando o status de um pagamento muda.
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: true });

  // MP envia vários tipos. Só tratamos "payment".
  const type = body.type ?? body.action?.split(".")?.[0];
  const paymentId = body.data?.id ?? body.resource;
  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  // Buscar a payment no MP precisa do accessToken da loja.
  // Como não sabemos qual loja sem consultar o pagamento, fazemos um passo extra:
  // tentamos descobrir a order via external_reference usando o primeiro token que funcionar.
  // Abordagem mais limpa: o MP retorna metadata.storeId se configuramos (fizemos).
  // Mas pra buscar o payment precisamos do token. Fazemos um "probe": percorremos
  // as configs até uma funcionar. Na prática, a loja é única para um paymentId.
  const configs = await db.mercadoPagoConfig.findMany();
  let mpPayment: any = null;
  let matchedStoreId: string | null = null;

  for (const config of configs) {
    try {
      const client = new MercadoPagoConfig({ accessToken: config.accessToken });
      const payment = new Payment(client);
      const result = await payment.get({ id: String(paymentId) });
      if (result?.id) {
        mpPayment = result;
        matchedStoreId = config.storeId;
        break;
      }
    } catch {
      // token não corresponde a esse pagamento — continua
    }
  }

  if (!mpPayment || !matchedStoreId) {
    console.warn("Webhook MP: payment não encontrado em nenhuma loja", paymentId);
    return NextResponse.json({ ok: true });
  }

  const orderId = mpPayment.external_reference ?? mpPayment.metadata?.order_id;
  if (!orderId) return NextResponse.json({ ok: true });

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, storeId: true, status: true },
  });
  if (!order || order.storeId !== matchedStoreId) {
    console.warn("Webhook MP: order não corresponde à loja", { orderId, matchedStoreId });
    return NextResponse.json({ ok: true });
  }

  const mpStatus: string = mpPayment.status; // approved | pending | rejected | in_process | refunded | cancelled
  const orderStatus: OrderStatus =
    mpStatus === "approved" ? "PAID" :
    mpStatus === "rejected" || mpStatus === "cancelled" ? "CANCELLED" :
    "PENDING";
  const paymentStatus: PaymentStatus =
    mpStatus === "approved" ? "APPROVED" :
    mpStatus === "rejected" || mpStatus === "cancelled" ? "REJECTED" :
    mpStatus === "refunded" ? "REFUNDED" :
    "PENDING";

  await db.order.update({ where: { id: order.id }, data: { status: orderStatus } });
  await db.payment.updateMany({
    where: { orderId: order.id },
    data: { status: paymentStatus, externalId: String(mpPayment.id) },
  });

  // Se pago, limpa o carrinho e decrementa estoque.
  if (orderStatus === "PAID" && order.status !== "PAID") {
    const fullOrder = await db.order.findUnique({
      where: { id: order.id },
      include: { items: true, customer: { select: { id: true } } },
    });
    if (fullOrder) {
      await db.cart.deleteMany({ where: { customerId: fullOrder.customer.id } });
      for (const item of fullOrder.items) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
