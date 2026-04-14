import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/HeroSection";
import StorefrontGrid from "@/components/StorefrontGrid";
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
      {/* 1 · AnnouncementBar (Lovable) */}
      <AnnouncementBar themeColor={store.themeColor} />

      {/* 2 · Header (Vendflow — engenharia preservada) */}
      <StoreHeader
        store={header}
        categories={categoryNames}
        cartCount={cartCount}
        isLoggedIn={!!customer}
      />

      <main className="pt-16">
        {/* 3 · HeroSection (Lovable) */}
        <HeroSection
          storeName={store.name}
          description={store.description}
          themeColor={store.themeColor}
          ctaHref="#produtos"
        />

        {/* Espaçamento elegante entre Hero e Grid */}
        <div id="produtos" className="py-8 sm:py-12">
          {/* 4 · StorefrontGrid (Lovable + Vendflow) */}
          {store.products.length === 0 ? (
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">Nenhum produto ainda</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  Esta loja está se preparando. Volte em breve para conferir as novidades!
                </p>
              </div>
            </section>
          ) : (
            <StorefrontGrid
              storeSlug={store.slug}
              themeColor={store.themeColor}
              isLoggedIn={!!customer}
              title="Destaques"
              subtitle={`${store.products.length} ${store.products.length === 1 ? "produto disponível" : "produtos disponíveis"} selecionados com os melhores preços.`}
              products={store.products}
            />
          )}
        </div>
      </main>

      <StoreFooter store={footer} />
    </>
  );
}
