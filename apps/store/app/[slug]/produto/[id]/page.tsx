import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Share2, MessageCircle, Shield, ArrowLeft, Check } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { buildStoreChrome, formatBRL } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getCartItemCount } from "@/lib/cart";
import { db } from "@vendflow/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  try {
    const store = await db.store.findUnique({
      where: { slug },
      select: { id: true, name: true, logoUrl: true },
    });
    if (!store) return { title: "Loja não encontrada · Vendflow" };
    const product = await db.product.findFirst({
      where: { id, storeId: store.id },
      select: { name: true, description: true },
    });
    if (!product) return { title: `${store.name} · Vendflow` };
    return {
      title: `${product.name} · ${store.name}`,
      description: product.description ?? `${product.name} - ${store.name}`,
      icons: store.logoUrl ? [{ rel: "icon", url: store.logoUrl }] : undefined,
    };
  } catch {
    return { title: "Vendflow" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const store = await db.store.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, description: true, themeColor: true, active: true },
  });
  if (!store || !store.active) notFound();

  const product = await db.product.findFirst({
    where: { id, storeId: store.id, active: true },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await db.product.findMany({
    where: {
      storeId: store.id,
      active: true,
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const { header, footer } = buildStoreChrome(store);
  const customer = await getCurrentCustomer(store.id);
  const cartCount = customer ? await getCartItemCount(customer.id) : 0;

  return (
    <>
      <StoreHeader store={header} cartCount={cartCount} isLoggedIn={!!customer} />

      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href={`/${store.slug}`} className="hover:text-gray-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Início
            </a>
            <span>/</span>
            <span className="text-gray-500 font-medium">{product.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              <div className="w-full aspect-square rounded-2xl bg-gray-100 overflow-hidden relative">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : null}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden border-2 relative"
                      style={i === 0 ? { borderColor: store.themeColor } : { borderColor: "transparent" }}
                    >
                      <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {product.category && (
                <p className="text-sm font-medium text-gray-400 mb-1">{product.category.name}</p>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>

              <div className="mb-5">
                <p className="text-4xl font-extrabold" style={{ color: store.themeColor }}>
                  {formatBRL(product.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ou 3x de {formatBRL(product.price / 3)} sem juros
                </p>
              </div>

              {product.stock > 0 && product.stock <= 10 && (
                <div className="flex items-center gap-2 mb-4 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  Apenas {product.stock} em estoque!
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <AddToCartButton
                  productId={product.id}
                  storeSlug={store.slug}
                  themeColor={store.themeColor}
                  stock={product.stock}
                  isLoggedIn={!!customer}
                />
                <button className="sm:w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
                {[
                  { icon: MessageCircle, text: "Frete: a combinar via WhatsApp" },
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

          {product.description && (
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Você também pode gostar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    storeSlug={store.slug}
                    themeColor={store.themeColor}
                    product={p}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <StoreFooter store={footer} />
    </>
  );
}
