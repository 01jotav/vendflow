import { ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { auth } from "@/auth";
import { db } from "@vendflow/database";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pendente",  color: "bg-yellow-100 text-yellow-700" },
  PAID:       { label: "Pago",      color: "bg-green-100 text-green-700" },
  PROCESSING: { label: "Processando", color: "bg-purple-100 text-purple-700" },
  SHIPPED:    { label: "Enviado",   color: "bg-blue-100 text-blue-700" },
  DELIVERED:  { label: "Entregue",  color: "bg-gray-100 text-gray-600" },
  CANCELLED:  { label: "Cancelado", color: "bg-red-100 text-red-600" },
};

export default async function PedidosPage() {
  const session = await auth();
  const storeId = session?.user?.store?.id;

  const orders = storeId
    ? await db.order.findMany({
        where: { storeId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const counts = {
    PENDING:   orders.filter((o) => o.status === "PENDING").length,
    PAID:      orders.filter((o) => o.status === "PAID").length,
    SHIPPED:   orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pedidos</h2>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} pedidos no total</p>
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pendentes", value: counts.PENDING,   color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
          { label: "Pagos",     value: counts.PAID,      color: "bg-green-50 border-green-100 text-green-700" },
          { label: "Enviados",  value: counts.SHIPPED,   color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Entregues", value: counts.DELIVERED, color: "bg-gray-50 border-gray-100 text-gray-600" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.color}`}>
            <p className="text-2xl font-extrabold">{item.value}</p>
            <p className="text-xs font-medium mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Nenhum pedido ainda</h3>
          <p className="text-sm text-gray-400">Os pedidos da sua loja aparecerão aqui.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pedido</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Itens</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const status = statusMap[order.status] ?? statusMap.PENDING;
                  const firstProduct = order.items[0]?.product?.name ?? "—";
                  const extraItems = order.items.length - 1;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono font-bold text-gray-700">
                          #{order.id.slice(-4).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.customerPhone ?? order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600 truncate max-w-[160px]">{firstProduct}</p>
                        {extraItems > 0 && (
                          <p className="text-xs text-gray-400">+{extraItems} {extraItems === 1 ? "item" : "itens"}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          R$ {order.total.toFixed(2).replace(".", ",")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
