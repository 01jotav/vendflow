import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@vendflow/database";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 * Recebe eventos do Stripe e atualiza o plano da loja.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const storeId = session.metadata?.storeId ?? session.client_reference_id;
      if (!storeId) break;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      await db.store.update({
        where: { id: storeId },
        data: {
          plan: "PRO",
          stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
          stripeSubscriptionId: subscriptionId ?? undefined,
          stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? undefined,
        },
      });
      console.log(`[Stripe Webhook] Store ${storeId} upgraded to PRO`);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

      const store = await db.store.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });
      if (!store) break;

      const isActive = subscription.status === "active" || subscription.status === "trialing";
      await db.store.update({
        where: { id: store.id },
        data: {
          plan: isActive ? "PRO" : "BASIC",
          stripeSubscriptionId: subscription.id,
        },
      });
      console.log(`[Stripe Webhook] Store ${store.id} subscription ${subscription.status}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

      const store = await db.store.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });
      if (!store) break;

      await db.store.update({
        where: { id: store.id },
        data: {
          plan: "BASIC",
          stripeSubscriptionId: null,
          stripePriceId: null,
        },
      });
      console.log(`[Stripe Webhook] Store ${store.id} downgraded to BASIC (subscription deleted)`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
