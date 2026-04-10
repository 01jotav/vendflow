import { db } from "@vendflow/database";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { brl, storeUrl } from "@/lib/format";
import { PAID_ORDER_STATUSES } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminLojasPage() {
  const stores = await db.store.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { products: true, orders: true } },
    },
  });

  // GMV por loja (soma dos pedidos pagos)
  const gmvByStore = await db.order.groupBy({
    by: ["storeId"],
    where: { status: { in: PAID_ORDER_STATUSES } },
    _sum: { total: true },
  });
  const gmvMap = new Map(gmvByStore.map((r) => [r.storeId, r._sum.total ?? 0]));


  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Todas as lojas ({stores.length})</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Loja</th>
                <th className="px-5 py-3 font-medium">Dono</th>
                <th className="px-5 py-3 font-medium text-center">Produtos</th>
                <th className="px-5 py-3 font-medium text-center">Pedidos</th>
                <th className="px-5 py-3 font-medium text-right">GMV</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
                <th className="px-5 py-3 font-medium text-center">Criada em</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/lojas/${store.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {store.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">/{store.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-700">{store.owner.name}</p>
                    <p className="text-xs text-gray-400">{store.owner.email}</p>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-700">{store._count.products}</td>
                  <td className="px-5 py-3 text-center text-gray-700">{store._count.orders}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">{brl(gmvMap.get(store.id) ?? 0)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${store.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {store.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-500 text-xs">
                    {store.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <a
                      href={storeUrl(store.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                      title="Ver loja"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    Nenhuma loja cadastrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
