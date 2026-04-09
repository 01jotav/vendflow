import { notFound, redirect } from "next/navigation";
import { db } from "@vendflow/database";
import { buildStoreChrome } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function CadastroPage({ params }: { params: Promise<{ slug: string }> }) {
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Criar conta</h1>
            <p className="text-sm text-gray-500 mb-6">
              Cadastre-se para comprar em {store.name} e acompanhar seus pedidos.
            </p>
            <SignupForm slug={store.slug} themeColor={store.themeColor} />
            <p className="text-sm text-gray-500 mt-5 text-center">
              Já tem conta?{" "}
              <a href={`/${store.slug}/login`} className="font-semibold" style={{ color: store.themeColor }}>
                Entrar
              </a>
            </p>
          </div>
        </div>
      </main>
      <StoreFooter store={footer} />
    </>
  );
}
