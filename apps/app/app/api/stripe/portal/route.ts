import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/stripe/portal
 * Cria uma sessão do Stripe Customer Portal para gerenciar assinatura.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.store?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const store = await db.store.findUnique({
    where: { id: session.user.store.id },
    select: { stripeCustomerId: true },
  });

  if (!store?.stripeCustomerId) {
    return NextResponse.json({ error: "Nenhuma assinatura ativa" }, { status: 400 });
  }

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3001";

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: store.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
