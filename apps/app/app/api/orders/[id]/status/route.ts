import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import type { OrderStatus } from "@prisma/client";
import { VALID_TRANSITIONS, STATUSES_WITH_STOCK, statusMap } from "@/lib/order-status";

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

  if (!newStatus || !statusMap[newStatus]) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  // Busca o pedido e valida ownership
  const order = await db.order.findUnique({
    where: { id },
    select: { storeId: true, status: true },
  });
  if (!order || order.storeId !== storeId) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  // Valida transição via state machine
  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    const currentLabel = statusMap[order.status].label;
    const allowedLabels = allowed.map((s) => statusMap[s].label).join(", ") || "nenhum";
    return NextResponse.json(
      { error: `Não é possível mudar de "${currentLabel}" para "${statusMap[newStatus].label}". Transições permitidas: ${allowedLabels}` },
      { status: 422 },
    );
  }

  // Se cancelando um pedido que já teve estoque decrementado, restaurar
  if (newStatus === "CANCELLED" && STATUSES_WITH_STOCK.includes(order.status)) {
    const items = await db.orderItem.findMany({
      where: { orderId: id },
      select: { productId: true, quantity: true },
    });
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json({ ok: true, status: newStatus });
}
