import { notFound } from "next/navigation";
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, ArrowLeft, Check } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { store, products } from "@/lib/mock-store";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <StoreHeader cartCount={0} />

      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-gray-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Início
            </a>
            <span>/</span>
            <span className="text-gray-500 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Produto */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Galeria */}
            <div className="space-y-3">
              {/* Imagem principal */}
              <div className={`w-full aspect-square rounded-2xl ${product.images[0]} relative`}>
                {discount && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    -{discount}%
                  </span>
                )}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`w-20 h-20 rounded-xl ${img} border-2 transition-all ${
                      i === 0 ? "border-opacity-100" : "border-transparent hover:border-gray-200"
                    }`}
                    style={i === 0 ? { borderColor: store.themeColor } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-400 mb-1">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.floor(product.rating) ? "#facc15" : "none"}
                      stroke={i < Math.floor(product.rating) ? "#facc15" : "#d1d5db"}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviews} avaliações)</span>
              </div>

              {/* Preço */}
              <div className="mb-5">
                {product.originalPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                )}
                <p className="text-4xl font-extrabold" style={{ color: store.themeColor }}>
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ou 3x de R$ {(product.price / 3).toFixed(2).replace(".", ",")} sem juros
                </p>
              </div>

              {/* Estoque */}
              {product.stock > 0 && product.stock <= 10 && (
                <div className="flex items-center gap-2 mb-4 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  Apenas {product.stock} em estoque!
                </div>
              )}

              {/* Quantidade */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-semibold">-</button>
                  <span className="px-5 py-2.5 text-sm font-bold border-x border-gray-200">1</span>
                  <button className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-semibold">+</button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: store.themeColor }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.stock === 0 ? "Esgotado" : "Adicionar ao carrinho"}
                </button>
                <button className="sm:w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Comprar direto */}
              {product.stock > 0 && (
                <a
                  href="/checkout"
                  className="text-center py-3.5 rounded-xl border-2 font-semibold text-sm transition-all hover:bg-gray-50"
                  style={{ borderColor: store.themeColor, color: store.themeColor }}
                >
                  Comprar agora
                </a>
              )}

              {/* Garantias */}
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
                {[
                  { icon: Truck,  text: "Frete grátis acima de R$ 150" },
                  { icon: Shield, text: "Compra 100% segura — SSL" },
                  { icon: Check,  text: "Troca em até 7 dias" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: store.themeColor }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Produtos relacionados */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Você também pode gostar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((p) => (
                  <a
                    key={p.id}
                    href={`/produto/${p.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className={`h-36 ${p.images[0]}`} />
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</p>
                      <p className="text-sm font-extrabold" style={{ color: store.themeColor }}>
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </>
  );
}
