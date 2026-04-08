import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { store, products } from "@/lib/mock-store";

// Carrinho mockado — futuramente virá de contexto/zustand
const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[1], quantity: 2 },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShipping = subtotal >= 150;
  const shipping = freeShipping ? 0 : 18.9;
  const total = subtotal + shipping;

  return (
    <>
      <StoreHeader cartCount={cartItems.length} />

      <main className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <a href="/" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-extrabold text-gray-900">Meu carrinho</h1>
            <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-400 mb-2">Carrinho vazio</h2>
              <p className="text-gray-400 mb-6">Adicione produtos para continuar.</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: store.themeColor }}
              >
                <ShoppingBag className="w-4 h-4" /> Ver produtos
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Itens */}
              <div className="lg:col-span-2 space-y-3">
                {/* Barra frete grátis */}
                {!freeShipping && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                    <p className="text-sm text-amber-700 font-medium">
                      Falta{" "}
                      <strong>R$ {(150 - subtotal).toFixed(2).replace(".", ",")}</strong>{" "}
                      para frete grátis! 🚚
                    </p>
                    <div className="mt-2 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                {freeShipping && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                    <p className="text-sm text-green-700 font-medium">✅ Você ganhou frete grátis!</p>
                  </div>
                )}

                {/* Produtos */}
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-xl ${item.images[0]} flex-shrink-0`} />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">{item.category}</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-base font-extrabold mt-1" style={{ color: store.themeColor }}>
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <button className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">-</button>
                        <span className="px-3 py-1.5 text-sm font-bold border-x border-gray-200">{item.quantity}</span>
                        <button className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">+</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cupom */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                      <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Código de cupom"
                        className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
                      style={{ backgroundColor: store.themeColor }}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumo */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
                  <h2 className="font-bold text-gray-900 mb-4">Resumo do pedido</h2>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        R$ {subtotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Frete</span>
                      <span className={freeShipping ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
                        {freeShipping ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-5">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-extrabold" style={{ color: store.themeColor }}>
                        R$ {total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      ou 3x de R$ {(total / 3).toFixed(2).replace(".", ",")} sem juros
                    </p>
                  </div>

                  <a
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: store.themeColor }}
                  >
                    Finalizar compra
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="/"
                    className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-3"
                  >
                    Continuar comprando
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </>
  );
}
