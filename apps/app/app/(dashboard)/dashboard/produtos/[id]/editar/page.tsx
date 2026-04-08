import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { notFound, redirect } from "next/navigation";
import EditProdutoForm from "./EditProdutoForm";

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.store?.id) redirect("/dashboard");

  const product = await db.product.findFirst({
    where: { id, storeId: session.user.store.id },
    include: { category: true },
  });

  if (!product) notFound();

  return <EditProdutoForm product={product} />;
}
