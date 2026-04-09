import { notFound, redirect } from "next/navigation";
import { db } from "@vendflow/database";
import { ShoppingBag } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { buildStoreChrome, formatBRL } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getOrCreateCart, getCartItemCount } from "@/lib/cart";
import CartItemRow from "./CartItemRow";
import CheckoutButton from "./CheckoutButton";

export const dynamic = "force-dynamic";

export default async function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, description: true, themeColor: true, active: true },
  });
  if (!store || !store.active) notFound();

  const customer = await getCurrentCustomer(store.id);
  if (!customer) redirect(`/${store.slug}/login`);

  const cart = await getOrCreateCart(customer.id);
  const cartCount = await getCartItemCount(customer.id);
  const { header, footer } = buildStoreChrome(store);
  const storeWithMp = await db.store.findUnique({
    where: { id: store.id },
    select: { mercadoPago: { select: { id: true } } },
  });
  const paymentsReady = !!storeWithMp?.mercadoPago;

  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <>
      <StoreHeader store={header} cartCount={cartCount} isLoggedIn />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Meu carrinho</h1>

          {cart.items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">Seu carrinho está vazio.</p>
              <a
                href={`/${store.slug}`}
                className="inline-block px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: store.themeColor }}
              >
                Ver produtos
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={{
                      id: item.id,
                      quantity: item.quantity,
                      product: {
                        id: item.productId,
                        name: item.product.name,
                        price: item.product.price,
                        images: item.product.images,
                      },
                    }}
                    themeColor={store.themeColor}
                  />
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
                <h2 className="font-bold text-gray-900 mb-4">Resumo</h2>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-extrabold text-gray-900 mb-5">
                  <span>Total</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <CheckoutButton themeColor={store.themeColor} disabled={!paymentsReady} />
                {!paymentsReady && (
                  <p className="text-xs text-amber-600 text-center mt-3">
                    Esta loja ainda não configurou pagamentos.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter store={footer} />
    </>
  );
}
