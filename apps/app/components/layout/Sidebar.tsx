"use client";

import { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Visão geral",  href: "/dashboard" },
  { icon: Store,           label: "Minha loja",   href: "/dashboard/loja" },
  { icon: Package,         label: "Produtos",      href: "/dashboard/produtos" },
  { icon: ShoppingBag,     label: "Pedidos",       href: "/dashboard/pedidos" },
  { icon: MessageCircle,   label: "WhatsApp",      href: "/dashboard/whatsapp" },
  { icon: CreditCard,      label: "Meu plano",     href: "/dashboard/plano" },
];

interface SidebarProps {
  currentPath: string;
  storeSlug: string | null;
}

export default function Sidebar({ currentPath, storeSlug }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "hidden lg:flex flex-col bg-sidebar border-r border-white/5 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={clsx("flex items-center h-16 px-4 border-b border-white/5", collapsed ? "justify-center" : "gap-2")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg">Vendflow</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = currentPath === href;
          return (
            <a
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={clsx(
                "sidebar-item",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={clsx("flex-shrink-0", isActive ? "w-5 h-5 text-white" : "w-5 h-5")} />
              {!collapsed && <span>{label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {storeSlug && (
          <a
            href={`https://${storeSlug}.vendflow.com.br`}
            target="_blank"
            rel="noreferrer"
            title={collapsed ? "Ver minha loja" : undefined}
            className={clsx("sidebar-item sidebar-item-inactive", collapsed && "justify-center px-2")}
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Ver minha loja</span>}
          </a>
        )}
        <a
          href="/login"
          title={collapsed ? "Sair" : undefined}
          className={clsx("sidebar-item text-red-400/60 hover:bg-red-500/10 hover:text-red-400", collapsed && "justify-center px-2")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </a>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx("sidebar-item sidebar-item-inactive w-full mt-2", collapsed && "justify-center px-2")}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
