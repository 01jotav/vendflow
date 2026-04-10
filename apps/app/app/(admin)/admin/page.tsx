import { db } from "@vendflow/database";
import { Store, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { brl } from "@/lib/format";
import { PAID_ORDER_STATUSES } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalStores,
    newStoresMonth,
    totalOrdersMonth,
    recentOrders,
  ] = await Promise.all([
    db.store.count({ where: { active: true } }),
    db.store.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.findMany({
      where: {
        status: { in: PAID_ORDER_STATUSES },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { total: true, createdAt: true },
    }),
  ]);

  const gmvTotal = recentOrders.reduce((sum, o) => sum + o.total, 0);

  // Agrupa GMV por dia a partir dos pedidos já buscados
  const gmvByDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    gmvByDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of recentOrders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    gmvByDay.set(key, (gmvByDay.get(key) ?? 0) + o.total);
  }

  const chartData = Array.from(gmvByDay.entries()).map(([date, total]) => ({ date, total }));
  const maxGmv = Math.max(...chartData.map((d) => d.total), 1);

  const cards = [
    { label: "Lojas ativas",       value: totalStores,      icon: Store,       color: "bg-blue-500" },
    { label: "Novas no mês",       value: newStoresMonth,   icon: TrendingUp,  color: "bg-green-500" },
    { label: "Pedidos no mês",     value: totalOrdersMonth, icon: ShoppingBag, color: "bg-purple-500" },
    { label: "GMV (30 dias)",      value: brl(gmvTotal),    icon: DollarSign,  color: "bg-amber-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GMV Chart (simple bar chart via CSS) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">GMV por dia (últimos 30 dias)</h2>
        <div className="flex items-end gap-1 h-40">
          {chartData.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-sm min-h-[2px] transition-all hover:opacity-80"
                style={{ height: `${(d.total / maxGmv) * 100}%` }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {d.date.slice(5)} — {brl(d.total)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{chartData[0]?.date.slice(5)}</span>
          <span>{chartData[chartData.length - 1]?.date.slice(5)}</span>
        </div>
      </div>
    </div>
  );
}
