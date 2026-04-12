import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/stripe/portal
 * Cria uma sessão do Stripe Customer Portal para gerenciar assinatura.
 */
export async function POST(req: Request) {
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

  const origin = req.headers.get("origin")
    || req.headers.get("referer")?.replace(/\/[^/]*$/, "")
    || process.env.NEXT_PUBLIC_APP_URL
    || process.env.AUTH_URL;

  if (!origin) {
    return NextResponse.json({ error: "Não foi possível determinar a URL base" }, { status: 500 });
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: store.stripeCustomerId,
    return_url: `${origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
