import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { redirect } from "next/navigation";
import PagamentosForm from "./PagamentosForm";

export default async function PagamentosPage() {
  const session = await auth();
  if (!session?.user?.store?.id) redirect("/dashboard");

  const config = await db.mercadoPagoConfig.findUnique({
    where: { storeId: session.user.store.id },
    select: { publicKey: true, liveMode: true, mpUserId: true, updatedAt: true },
  });

  return <PagamentosForm initial={config} />;
}
