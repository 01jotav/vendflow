import {
  TrendingUp, ShoppingBag, Package, Users,
  ArrowUpRight, ArrowRight, AlertCircle, ExternalLink,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@vendflow/database";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  PENDING:    { label: "Pendente", className: "bg-yellow-100 text-yellow-700" },
  PAID:       { label: "Pago",     className: "bg-green-100 text-green-700" },
  PROCESSING: { label: "Em preparo", className: "bg-blue-100 text-blue-700" },
  SHIPPED:    { label: "Enviado",  className: "bg-blue-100 text-blue-700" },
  DELIVERED:  { label: "Entregue", className: "bg-gray-100 text-gray-600" },
  CANCELLED:  { label: "Cancelado", className: "bg-red-100 text-red-700" },
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function pctChange(curr: number, prev: number): { change: string; up: boolean } {
  if (prev === 0) {
    if (curr === 0) return { change: "—", up: true };
    return { change: "+100%", up: true };
  }
  const delta = ((curr - prev) / prev) * 100;
  const up = delta >= 0;
  return { change: `${up ? "+" : ""}${delta.toFixed(0)}%`, up };
}

export default async function DashboardPage() {
  const session = await auth();
  const userName  = session?.user?.name?.split(" ")[0] ?? "Lojista";
  const storeName = session?.user?.store?.name ?? "Minha Loja";
  const storeSlug = session?.user?.store?.slug ?? "#";
  const storeId   = session?.user?.store?.id;
  const storeBase = process.env.NEXT_PUBLIC_STORE_URL ?? "https://vendflow-store.vercel.app";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    paidThisMonth,
    paidPrevMonth,
    ordersThisMonth,
    ordersPrevMonth,
    activeProducts,
    customersCount,
    customersPrevMonth,
    recentOrdersRaw,
  ] = storeId
    ? await Promise.all([
        db.order.aggregate({
          where: { storeId, status: { not: "CANCELLED" }, createdAt: { gte: startOfMonth } },
          _sum: { total: true },
        }),
        db.order.aggregate({
          where: {
            storeId,
            status: { not: "CANCELLED" },
            createdAt: { gte: startOfPrevMonth, lt: startOfMonth },
          },
          _sum: { total: true },
        }),
        db.order.count({ where: { storeId, createdAt: { gte: startOfMonth } } }),
        db.order.count({
          where: { storeId, createdAt: { gte: startOfPrevMonth, lt: startOfMonth } },
        }),
        db.product.count({ where: { storeId, active: true } }),
        db.customer.count({ where: { storeId } }),
        db.customer.count({
          where: { storeId, createdAt: { lt: startOfMonth } },
        }),
        db.order.findMany({
          where: { storeId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            customer: { select: { name: true } },
            items: {
              take: 1,
              include: { product: { select: { name: true } } },
            },
          },
        }),
      ])
    : [null, null, 0, 0, 0, 0, 0, []];

  const revenueCurr = paidThisMonth?._sum.total ?? 0;
  const revenuePrev = paidPrevMonth?._sum.total ?? 0;
  const revenueDelta = pctChange(revenueCurr, revenuePrev);
  const ordersDelta = pctChange(ordersThisMonth, ordersPrevMonth);
  const newCustomersThisMonth = customersCount - customersPrevMonth;

  const stats = [
    {
      label: "Faturamento (mês)",
      value: brl(revenueCurr),
      change: revenueDelta.change,
      up: revenueDelta.up,
      icon: TrendingUp,
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Pedidos (mês)",
      value: String(ordersThisMonth),
      change: ordersDelta.change,
      up: ordersDelta.up,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Produtos ativos",
      value: String(activeProducts),
      change: "",
      up: true,
      icon: Package,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Clientes",
      value: String(customersCount),
      change: newCustomersThisMonth > 0 ? `+${newCustomersThisMonth}` : "",
      up: true,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentOrders = recentOrdersRaw.map((o) => {
    const s = STATUS_STYLE[o.status] ?? STATUS_STYLE.PENDING;
    return {
      id: `#${o.id.slice(-4).toUpperCase()}`,
      customer: o.customer?.name ?? "—",
      product: o.items[0]?.product.name ?? "—",
      value: brl(o.total),
      status: s.label,
      statusColor: s.className,
    };
  });
  const quickActions = [
    { label: "Adicionar produto", href: "/dashboard/produtos/novo", icon: Package,      color: "bg-violet-600", external: false },
    { label: "Ver minha loja",    href: `${storeBase}/${storeSlug}`, icon: ExternalLink, color: "bg-gray-800",   external: true  },
    { label: "Configurar loja",   href: "/dashboard/loja",          icon: AlertCircle,  color: "bg-pink-600",   external: false },
  ];
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Boas vindas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Olá, {userName}! 👋</h2>
          <p className="text-gray-500 text-sm mt-0.5">Aqui está o resumo da sua loja hoje.</p>
        </div>
        <a
          href="/dashboard/produtos/novo"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all"
        >
          + Novo produto
        </a>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                      stat.up ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <ArrowUpRight className={`w-3 h-3 ${!stat.up && "rotate-180"}`} />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pedidos recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Pedidos recentes</h3>
            <a href="/dashboard/pedidos" className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline">
              Ver todos <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-gray-400">
                Nenhum pedido ainda. Quando alguém comprar na sua loja, os pedidos aparecem aqui.
              </div>
            )}
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{order.id}</span>
                    <span className="text-sm font-medium text-gray-900 truncate">{order.customer}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{order.product}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{order.value}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita */}
        <div className="space-y-4">
          {/* Ações rápidas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Ações rápidas</h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noreferrer" : undefined}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Status da loja */}
          <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/80">Loja ativa</span>
            </div>
            <p className="text-sm font-bold mb-1">{storeName}</p>
            <p className="text-xs text-white/60 mb-4 truncate">/{storeSlug}</p>
            <a
              href={`${process.env.NEXT_PUBLIC_STORE_URL ?? "https://vendflow-store.vercel.app"}/${storeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors px-3 py-2 rounded-lg w-fit"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir loja
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
