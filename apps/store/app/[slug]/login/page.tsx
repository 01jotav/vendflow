import { notFound, redirect } from "next/navigation";
import { db } from "@vendflow/database";
import { buildStoreChrome } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, description: true, themeColor: true, active: true },
  });
  if (!store || !store.active) notFound();

  const current = await getCurrentCustomer(store.id);
  if (current) redirect(`/${store.slug}`);

  const { header, footer } = buildStoreChrome(store);

  return (
    <>
      <StoreHeader store={header} cartCount={0} />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Entrar</h1>
            <p className="text-sm text-gray-500 mb-6">
              Acesse sua conta em {store.name}.
            </p>
            <LoginForm slug={store.slug} themeColor={store.themeColor} />
            <p className="text-sm text-gray-500 mt-5 text-center">
              Não tem conta?{" "}
              <a href={`/${store.slug}/cadastro`} className="font-semibold" style={{ color: store.themeColor }}>
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </main>
      <StoreFooter store={footer} />
    </>
  );
}
