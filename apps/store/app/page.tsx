import { ShoppingBag, Star, Truck, Shield, RefreshCw } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { store, products, categories } from "@/lib/mock-store";

const perks = [
  { icon: Truck,     label: "Frete grátis acima de R$ 150" },
  { icon: Shield,    label: "Compra 100% segura" },
  { icon: RefreshCw, label: "Troca em até 7 dias" },
];

export default function StorePage() {
  const featured = products.filter((p) => p.featured);
  const all = products;

  return (
    <>
      <StoreHeader cartCount={0} />

      <main className="pt-16">
        {/* Hero banner */}
        <section
          className="relative overflow-hidden py-16 sm:py-24"
          style={{ background: `linear-gradient(135deg, ${store.themeColor}15 0%, ${store.themeColor}05 100%)` }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-6"
              style={{ backgroundColor: store.themeColor }}
            >
              <span>✨</span> Novidades da semana
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              Beleza que fala<br />
              <span style={{ color: store.themeColor }}>por si só</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              {store.description} Produtos selecionados para realçar o melhor de você.
            </p>
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm shadow-xl hover:opacity-90 hover:scale-105 transition-all"
              style={{ backgroundColor: store.themeColor }}
            >
              <ShoppingBag className="w-4 h-4" />
              Ver todos os produtos
            </a>
          </div>
        </section>

        {/* Perks */}
        <section className="border-y border-gray-100 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-2 text-center">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: store.themeColor }} />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Destaques */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">⭐ Mais vendidos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product) => (
              <a
                key={product.id}
                href={`/produto/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all overflow-hidden"
              >
                {/* Imagem */}
                <div className={`h-48 ${product.images[0]} relative`}>
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-xs text-gray-400 font-medium">{product.category}</span>
                  <h3 className="font-bold text-gray-900 mt-0.5 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < Math.floor(product.rating) ? "#facc15" : "none"}
                          stroke={i < Math.floor(product.rating) ? "#facc15" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                        </p>
                      )}
                      <p className="text-lg font-extrabold" style={{ color: store.themeColor }}>
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <span
                      className="text-xs text-white px-3 py-1.5 rounded-lg font-semibold"
                      style={{ backgroundColor: store.themeColor }}
                    >
                      + Carrinho
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Todos os produtos */}
        <section id="produtos" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Todos os produtos</h2>
            <span className="text-sm text-gray-400">{all.length} produtos</span>
          </div>

          {/* Filtro por categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  i === 0
                    ? "text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={i === 0 ? { backgroundColor: store.themeColor } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {all.map((product) => (
              <a
                key={product.id}
                href={`/produto/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
              >
                <div className={`h-36 sm:h-44 ${product.images[0]} relative`}>
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full border">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-opacity-80 transition-colors">
                    {product.name}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </p>
                  )}
                  <p className="text-base font-extrabold" style={{ color: store.themeColor }}>
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <StoreFooter />
    </>
  );
}
