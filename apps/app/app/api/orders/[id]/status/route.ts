import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import type { OrderStatus } from "@prisma/client";

const ALLOWED: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const storeId = session?.user?.store?.id;
  if (!storeId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const newStatus = body.status as OrderStatus | undefined;

  if (!newStatus || !ALLOWED.includes(newStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  // Garante que o pedido pertence à loja do lojista logado.
  const order = await db.order.findUnique({
    where: { id },
    select: { storeId: true, status: true },
  });
  if (!order || order.storeId !== storeId) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json({ ok: true, status: newStatus });
}
