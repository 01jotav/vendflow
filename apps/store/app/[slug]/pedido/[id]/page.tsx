import { notFound, redirect } from "next/navigation";
import { db } from "@vendflow/database";
import { Check, Clock, X } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { buildStoreChrome, formatBRL } from "@/lib/store-chrome";
import { getCurrentCustomer } from "@/lib/customer-auth";
import OrderStatusPoller from "@/components/OrderStatusPoller";
import WhatsAppButton from "@/components/WhatsAppButton";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const store = await db.store.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, description: true, themeColor: true, active: true, whatsappNumber: true },
  });
  if (!store || !store.active) notFound();

  const customer = await getCurrentCustomer(store.id);
  if (!customer) redirect(`/${store.slug}/login`);

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, payment: true, customer: true },
  });
  if (!order || order.customerId !== customer.id || order.storeId !== store.id) notFound();

  const { header, footer } = buildStoreChrome(store);

  const statusInfo = {
    PENDING:    { icon: Clock, color: "text-amber-600",  bg: "bg-amber-50",  title: "Aguardando pagamento", desc: "Assim que o pagamento for confirmado você será notificado." },
    PAID:       { icon: Check, color: "text-green-600",  bg: "bg-green-50",  title: "Pagamento aprovado!",   desc: "Seu pedido foi confirmado e será preparado em breve." },
    PROCESSING: { icon: Clock, color: "text-blue-600",   bg: "bg-blue-50",   title: "Em preparação",         desc: "A loja está preparando seu pedido." },
    SHIPPED:    { icon: Clock, color: "text-blue-600",   bg: "bg-blue-50",   title: "Enviado",                desc: "Seu pedido foi enviado." },
    DELIVERED:  { icon: Check, color: "text-green-600",  bg: "bg-green-50",  title: "Entregue",               desc: "Pedido entregue com sucesso." },
    CANCELLED:  { icon: X,     color: "text-red-600",    bg: "bg-red-50",    title: "Pagamento não aprovado", desc: "O pagamento foi recusado ou cancelado." },
  }[order.status];

  const Icon = statusInfo.icon;

  return (
    <>
      <StoreHeader store={header} cartCount={0} isLoggedIn />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <div className={`w-14 h-14 rounded-2xl ${statusInfo.bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${statusInfo.color}`} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{statusInfo.title}</h1>
            <p className="text-sm text-gray-500 mb-2">{statusInfo.desc}</p>
            <OrderStatusPoller orderId={order.id} initialStatus={order.status} />

            <div className="border-t border-gray-100 pt-5 mb-5">
              <p className="text-xs text-gray-400 mb-3">Pedido #{order.id.slice(-8).toUpperCase()}</p>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-900 font-medium">{item.product.name}</p>
                      <p className="text-gray-400 text-xs">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">{formatBRL(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between font-extrabold text-gray-900">
              <span>Total</span>
              <span>{formatBRL(order.total)}</span>
            </div>

            {/* WhatsApp CTA */}
            {store.whatsappNumber && order.status !== "CANCELLED" && (
              <WhatsAppButton
                whatsappNumber={store.whatsappNumber}
                storeName={store.name}
                orderCode={order.id.slice(-8).toUpperCase()}
                total={order.total}
                customerName={order.customer.name}
                customerPhone={order.customer.phone}
                address={order.customer.address as { rua?: string; numero?: string; bairro?: string; cep?: string } | null}
                items={order.items.map((item) => ({
                  quantity: item.quantity,
                  price: item.price,
                  product: { name: item.product.name },
                }))}
              />
            )}

            <a
              href={`/${store.slug}`}
              className="block text-center mt-3 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: store.themeColor }}
            >
              Voltar para a loja
            </a>
          </div>
        </div>
      </main>
      <StoreFooter store={footer} />
    </>
  );
}
