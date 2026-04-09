import { notFound, redirect } from "next/navigation";
import { db } from "@vendflow/database";
import { Package, Clock, Check, X } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { buildStoreChrome, formatBRL } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getCartItemCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  PENDING:    { label: "Aguardando pagamento", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  PAID:       { label: "Pago",                  icon: Check, color: "text-green-600", bg: "bg-green-50" },
  PROCESSING: { label: "Em preparação",         icon: Clock, color: "text-blue-600",  bg: "bg-blue-50" },
  SHIPPED:    { label: "Enviado",               icon: Clock, color: "text-blue-600",  bg: "bg-blue-50" },
  DELIVERED:  { label: "Entregue",              icon: Check, color: "text-green-600", bg: "bg-green-50" },
  CANCELLED:  { label: "Cancelado",             icon: X,     color: "text-red-600",   bg: "bg-red-50" },
};

export default async function MinhaContaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, description: true, themeColor: true, active: true },
  });
  if (!store || !store.active) notFound();

  const customer = await getCurrentCustomer(store.id);
  if (!customer) redirect(`/${store.slug}/login`);

  const [orders, cartCount] = await Promise.all([
    db.order.findMany({
      where: { customerId: customer.id, storeId: store.id },
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    getCartItemCount(customer.id),
  ]);

  const { header, footer } = buildStoreChrome(store);

  return (
    <>
      <StoreHeader store={header} cartCount={cartCount} isLoggedIn />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Olá, {customer.name.split(" ")[0]}</h1>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
            <form action="/api/customer/logout" method="POST">
              <button
                type="submit"
                className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">Meus pedidos</h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
              <a
                href={`/${store.slug}`}
                className="inline-block px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: store.themeColor }}
              >
                Começar a comprar
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const info = STATUS_LABEL[order.status] ?? STATUS_LABEL.PENDING;
                const Icon = info.icon;
                return (
                  <a
                    key={order.id}
                    href={`/${store.slug}/pedido/${order.id}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${info.bg} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${info.color}`} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-semibold text-gray-900">{info.label}</p>
                        </div>
                      </div>
                      <p className="font-extrabold text-gray-900">{formatBRL(order.total)}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {order.items.map((i) => i.product.name).join(", ")}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <StoreFooter store={footer} />
    </>
  );
}
