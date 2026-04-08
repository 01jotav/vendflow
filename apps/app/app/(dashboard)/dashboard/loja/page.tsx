import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { redirect } from "next/navigation";
import LojaForm from "./LojaForm";

export default async function LojaPage() {
  const session = await auth();
  if (!session?.user?.store?.id) redirect("/dashboard");

  const store = await db.store.findUnique({
    where: { id: session.user.store.id },
  });

  if (!store) redirect("/dashboard");

  return <LojaForm store={store} />;
}
