import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.store?.id) redirect("/dashboard");

  const store = await db.store.findUnique({
    where: { id: session.user.store.id },
    select: { plan: true, stripeCustomerId: true, stripeSubscriptionId: true },
  });

  if (!store) redirect("/dashboard");

  return (
    <BillingClient
      plan={store.plan}
      hasSubscription={!!store.stripeSubscriptionId}
    />
  );
}
