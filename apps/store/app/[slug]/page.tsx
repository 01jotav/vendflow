import { notFound } from "next/navigation";
import { ShoppingBag, Truck, Shield, RefreshCw } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { db } from "@vendflow/database";

const perks = [
  { icon: Truck,     label: "Frete grátis acima de R$ 150" },
  { icon: Shield,    label: "Compra 100% segura" },
  { icon: RefreshCw, label: "Troca em até 7 dias" },
];

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await db.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store || !store.active) notFound();

  const logoInitial = store.name.charAt(0).toUpperCase();
  const headerStore = { slug: store.slug, name: store.name, themeColor: store.themeColor, logoInitial };
  const footerStore = { name: store.name, description: store.description, themeColor: store.themeColor, logoInitial };

  const categoryNames = Array.from(
    new Set(store.products.map((p) => p.category?.name).filter((c): c is string => !!c))
  );

  return (
    <>
      <StoreHeader store={headerStore} categories={categoryNames} cartCount={0} />

      <main className="pt-16">
        <section
          className="relative overflow-hidden py-16 sm:py-24"
          style={{ background: `linear-gradient(135deg, ${store.themeColor}15 0%, ${store.themeColor}05 100%)` }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-6"
              style={{ backgroundColor: store.themeColor }}
            >
              <span>✨</span> Bem-vindo(a)
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">{store.description}</p>
            )}
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

        <section id="produtos" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Todos os produtos</h2>
            <span className="text-sm text-gray-400">{store.products.length} produtos</span>
          </div>

          {store.products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Esta loja ainda não tem produtos cadastrados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {store.products.map((product) => (
                <a
                  key={product.id}
                  href={`/${store.slug}/produto/${product.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
                >
                  <div className="h-36 sm:h-44 bg-gray-100 relative">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : null}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full border">
                          Esgotado
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    {product.category && (
                      <p className="text-xs text-gray-400 mb-0.5">{product.category.name}</p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5">
                      {product.name}
                    </p>
                    <p className="text-base font-extrabold" style={{ color: store.themeColor }}>
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter store={footerStore} />
    </>
  );
}
