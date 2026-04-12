import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/stripe/checkout
 * Cria uma Stripe Checkout Session para upgrade BASIC → PRO.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.store?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const store = await db.store.findUnique({
    where: { id: session.user.store.id },
    select: { id: true, plan: true, stripeCustomerId: true, name: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  if (store.plan === "PRO") {
    return NextResponse.json({ error: "Você já é PRO" }, { status: 400 });
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Price ID não configurado" }, { status: 500 });
  }

  // Reutiliza customer existente ou cria um novo
  let customerId = store.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      name: store.name,
      email: session.user.email ?? undefined,
      metadata: { storeId: store.id },
    });
    customerId = customer.id;
    await db.store.update({
      where: { id: store.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3001";

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    client_reference_id: store.id,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/billing?success=true`,
    cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
    metadata: { storeId: store.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
