import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoppingBag, MessageCircle, Shield, RefreshCw } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { buildStoreChrome } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getCartItemCount } from "@/lib/cart";
import { db } from "@vendflow/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const store = await db.store.findUnique({
      where: { slug },
      select: { name: true, description: true, logoUrl: true },
    });
    if (!store) return { title: "Loja não encontrada · Vendflow" };
    return {
      title: `${store.name} · Vendflow`,
      description: store.description ?? `Conheça os produtos de ${store.name}`,
      icons: store.logoUrl ? [{ rel: "icon", url: store.logoUrl }] : undefined,
    };
  } catch {
    return { title: "Vendflow" };
  }
}

const perks = [
  { icon: MessageCircle, label: "Frete: a combinar via WhatsApp" },
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

  const { header, footer } = buildStoreChrome(store);
  const customer = await getCurrentCustomer(store.id);
  const cartCount = customer ? await getCartItemCount(customer.id) : 0;

  const categoryNames = Array.from(
    new Set(store.products.map((p) => p.category?.name).filter((c): c is string => !!c))
  );

  return (
    <>
      <StoreHeader store={header} categories={categoryNames} cartCount={cartCount} isLoggedIn={!!customer} />

      <main className="pt-16">
        <section
          className="relative overflow-hidden py-14 sm:py-24"
          style={{ background: `linear-gradient(160deg, ${store.themeColor}12 0%, ${store.themeColor}04 60%, transparent 100%)` }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-5 shadow-lg"
              style={{ backgroundColor: store.themeColor, boxShadow: `0 4px 14px ${store.themeColor}40` }}
            >
              {"\u2728"} Bem-vindo(a)
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-8">{store.description}</p>
            )}
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: store.themeColor, boxShadow: `0 8px 24px ${store.themeColor}30` }}
            >
              <ShoppingBag className="w-4 h-4" />
              Ver todos os produtos
            </a>
          </div>
        </section>

        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${store.themeColor}12` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: store.themeColor }} />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Todos os produtos</h2>
            <span className="text-xs sm:text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {store.products.length} {store.products.length === 1 ? "produto" : "produtos"}
            </span>
          </div>

          {store.products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-base font-semibold text-gray-700 mb-1">Nenhum produto ainda</p>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                Esta loja está se preparando. Volte em breve para conferir as novidades!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {store.products.map((product) => (
                <ProductCard
                  key={product.id}
                  storeSlug={store.slug}
                  themeColor={store.themeColor}
                  product={product}
                  showCategory
                  showSoldOut
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter store={footer} />
    </>
  );
}
