import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { storeId } = await params;

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { active: true },
  });
  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  await db.store.update({
    where: { id: storeId },
    data: { active: !store.active },
  });

  return NextResponse.json({ ok: true, active: !store.active });
}
