"use client";

import { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Store,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Painel",  href: "/admin" },
  { icon: Store,           label: "Lojas",   href: "/admin/lojas" },
];

interface AdminSidebarProps {
  currentPath: string;
}

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "hidden lg:flex flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={clsx("flex items-center h-16 px-4 border-b border-white/5", collapsed ? "justify-center" : "gap-2")}>
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg">Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
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
        <a
          href="/dashboard"
          title={collapsed ? "Voltar ao dashboard" : undefined}
          className={clsx("sidebar-item sidebar-item-inactive", collapsed && "justify-center px-2")}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Voltar ao dashboard</span>}
        </a>

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
