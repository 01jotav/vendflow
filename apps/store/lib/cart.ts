import { db } from "@vendflow/database";

/**
 * Retorna o carrinho do customer (criando se não existir) com itens + produto.
 */
const cartSelect = {
  id: true,
  items: {
    select: {
      id: true,
      productId: true,
      quantity: true,
      product: { select: { name: true, price: true, images: true, stock: true } },
    },
    orderBy: { id: "asc" as const },
  },
};

export async function getOrCreateCart(customerId: string) {
  const existing = await db.cart.findUnique({ where: { customerId }, select: cartSelect });
  if (existing) return existing;
  return db.cart.create({ data: { customerId }, select: cartSelect });
}

/**
 * Versão leve do getOrCreateCart para operações de escrita (add/update).
 * Retorna apenas o cart id e items com productId + quantity (sem joins pesados).
 */
export async function getOrCreateCartLite(customerId: string) {
  const existing = await db.cart.findUnique({
    where: { customerId },
    select: { id: true, items: { select: { productId: true, quantity: true } } },
  });
  if (existing) return existing;
  return db.cart.create({
    data: { customerId },
    select: { id: true, items: { select: { productId: true, quantity: true } } },
  });
}

export async function getCartItemCount(customerId: string): Promise<number> {
  const items = await db.cartItem.findMany({
    where: { cart: { customerId } },
    select: { quantity: true },
  });
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
