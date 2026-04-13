import { NextResponse } from "next/server";
import { db } from "@vendflow/database";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getOrCreateCart, getOrCreateCartLite } from "@/lib/cart";

async function getSession() {
  const token = (await cookies()).get("vf_customer_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.CUSTOMER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.customerId !== "string" || typeof payload.storeId !== "string") return null;
    return { customerId: payload.customerId, storeId: payload.storeId };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { productId, quantity } = (body ?? {}) as { productId?: string; quantity?: number };
  if (!productId) return NextResponse.json({ error: "productId obrigatório" }, { status: 400 });
  const qty = Math.max(1, Math.floor(quantity ?? 1));

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, storeId: true, stock: true, active: true },
  });
  if (!product || !product.active) return NextResponse.json({ error: "Produto indisponível" }, { status: 404 });
  if (product.storeId !== session.storeId) {
    return NextResponse.json({ error: "Produto de outra loja" }, { status: 403 });
  }

  const cart = await getOrCreateCartLite(session.customerId);
  const existing = cart.items.find((i) => i.productId === productId);
  const newQty = (existing?.quantity ?? 0) + qty;
  if (product.stock > 0 && newQty > product.stock) {
    return NextResponse.json({ error: `Só temos ${product.stock} em estoque` }, { status: 400 });
  }

  await db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity: qty },
    update: { quantity: newQty },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { itemId, quantity } = (body ?? {}) as { itemId?: string; quantity?: number };
  if (!itemId || typeof quantity !== "number") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const item = await db.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: { select: { customerId: true } }, product: { select: { stock: true } } },
  });
  if (!item || item.cart.customerId !== session.customerId) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    if (item.product.stock > 0 && quantity > item.product.stock) {
      return NextResponse.json({ error: `Só temos ${item.product.stock} em estoque` }, { status: 400 });
    }
    await db.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId obrigatório" }, { status: 400 });

  const item = await db.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: { select: { customerId: true } } },
  });
  if (!item || item.cart.customerId !== session.customerId) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }
  await db.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
