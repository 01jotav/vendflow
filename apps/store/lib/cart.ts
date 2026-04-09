import { db } from "@vendflow/database";

/**
 * Retorna o carrinho do customer (criando se não existir) com itens + produto.
 */
export async function getOrCreateCart(customerId: string) {
  const existing = await db.cart.findUnique({
    where: { customerId },
    include: {
      items: {
        include: { product: { include: { store: { select: { slug: true, themeColor: true } } } } },
        orderBy: { id: "asc" },
      },
    },
  });
  if (existing) return existing;
  return db.cart.create({
    data: { customerId },
    include: {
      items: {
        include: { product: { include: { store: { select: { slug: true, themeColor: true } } } } },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function getCartItemCount(customerId: string): Promise<number> {
  const items = await db.cartItem.findMany({
    where: { cart: { customerId } },
    select: { quantity: true },
  });
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
