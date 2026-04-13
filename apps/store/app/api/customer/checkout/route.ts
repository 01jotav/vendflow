import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { db } from "@vendflow/database";

async function getSession() {
  const token = (await cookies()).get("vf_customer_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.CUSTOMER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.customerId !== "string" || typeof payload.storeId !== "string") return null;
    return { customerId: payload.customerId, storeId: payload.storeId };
  } catch {
    return null;
  }
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  // Carrega customer + loja + config MP + carrinho
  const [customer, store, cart] = await Promise.all([
    db.customer.findUnique({ where: { id: session.customerId } }),
    db.store.findUnique({
      where: { id: session.storeId },
      include: { mercadoPago: true },
    }),
    db.cart.findUnique({
      where: { customerId: session.customerId },
      include: { items: { include: { product: true } } },
    }),
  ]);

  if (!customer || !store) return NextResponse.json({ error: "Loja ou cliente inválido" }, { status: 404 });
  if (!store.mercadoPago) {
    return NextResponse.json({ error: "Esta loja ainda não configurou pagamentos" }, { status: 400 });
  }
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  // Valida estoque
  for (const item of cart.items) {
    if (item.product.stock > 0 && item.quantity > item.product.stock) {
      return NextResponse.json({
        error: `"${item.product.name}" tem apenas ${item.product.stock} em estoque`,
      }, { status: 400 });
    }
  }

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // 1. Cria Order PENDING no DB
  const order = await db.order.create({
    data: {
      storeId: store.id,
      customerId: customer.id,
      total,
      status: "PENDING",
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    },
  });

  // 2. Cria Preference no MP
  const storeBase = process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3002";
  const isLocal = storeBase.includes("localhost") || storeBase.includes("127.0.0.1");
  const backUrl = `${storeBase}/${store.slug}/pedido/${order.id}`;
  const webhookUrl = `${storeBase}/api/mercadopago/webhook?storeId=${store.id}`;

  const mpClient = new MercadoPagoConfig({ accessToken: store.mercadoPago.accessToken });
  const preference = new Preference(mpClient);

  try {
    const result = await preference.create({
      body: {
        items: cart.items.map((i) => ({
          id: i.productId,
          title: i.product.name,
          quantity: i.quantity,
          unit_price: i.product.price,
          currency_id: "BRL",
        })),
        payer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone ? { number: customer.phone } : undefined,
        },
        external_reference: order.id,
        back_urls: { success: backUrl, pending: backUrl, failure: backUrl },
        auto_return: "approved",
        // MP exige URLs públicas para notification_url — em dev (localhost) omitimos
        ...(isLocal ? {} : { notification_url: webhookUrl }),
        metadata: { orderId: order.id, storeId: store.id },
      },
    });

    // Salva payment record inicial
    await db.payment.create({
      data: {
        orderId: order.id,
        provider: "mercadopago",
        externalId: result.id!,
        status: "PENDING",
        amount: total,
      },
    });

    return NextResponse.json({ checkoutUrl: result.init_point, orderId: order.id });
  } catch (err) {
    // Rollback da order (deleta items primeiro por causa da FK)
    await db.orderItem.deleteMany({ where: { orderId: order.id } }).catch(() => null);
    await db.order.delete({ where: { id: order.id } }).catch(() => null);
    console.error("MP preference error:", err);
    return NextResponse.json({ error: "Erro ao criar pagamento no Mercado Pago" }, { status: 500 });
  }
}
