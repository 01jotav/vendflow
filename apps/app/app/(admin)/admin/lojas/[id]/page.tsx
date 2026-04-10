import { notFound } from "next/navigation";
import { db } from "@vendflow/database";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ToggleStoreButton from "./ToggleStoreButton";
import { brl, storeUrl } from "@/lib/format";
import { PAID_ORDER_STATUSES, statusMap } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminStoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [store, recentOrders, topProducts, gmvAgg] = await Promise.all([
    db.store.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { products: true, orders: true, customers: true } },
      },
    }),
    db.order.findMany({
      where: { storeId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { customer: { select: { name: true } } },
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      where: { order: { storeId: id, status: { in: PAID_ORDER_STATUSES } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.order.aggregate({
      where: { storeId: id, status: { in: PAID_ORDER_STATUSES } },
      _sum: { total: true },
    }),
  ]);
  if (!store) notFound();

  const productIds = topProducts.map((p) => p.productId);
  const products = productIds.length
    ? await db.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true } })
    : [];
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const url = storeUrl(store.slug);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link href="/admin/lojas" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Voltar pra lista
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">/{store.slug} · Dono: {store.owner.name} ({store.owner.email})</p>
            <p className="text-xs text-gray-400 mt-1">Criada em {store.createdAt.toLocaleDateString("pt-BR")}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Ver loja
            </a>
            <ToggleStoreButton storeId={store.id} active={store.active} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Produtos", value: store._count.products },
          { label: "Pedidos",  value: store._count.orders },
          { label: "Clientes", value: store._count.customers },
          { label: "GMV",      value: brl(gmvAgg._sum.total ?? 0) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produtos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Produtos mais vendidos</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Sem vendas ainda.</p>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((tp, i) => (
                <li key={tp.productId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>
                    {productMap.get(tp.productId) ?? "—"}
                  </span>
                  <span className="font-medium text-gray-900">{tp._sum.quantity ?? 0} un.</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Últimos pedidos</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum pedido ainda.</p>
          ) : (
            <ul className="space-y-2">
              {recentOrders.map((o) => {
                const st = statusMap[o.status] ?? { label: o.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <li key={o.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">#{o.id.slice(-6).toUpperCase()}</span>
                      <span className="text-gray-700 ml-2">{o.customer?.name ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{brl(o.total)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
