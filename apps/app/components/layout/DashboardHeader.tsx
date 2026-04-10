"use client";

import { useState } from "react";
import {
  Bell, Menu, X, Search, Zap, LayoutDashboard, Store,
  Package, ShoppingBag, LogOut, ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { logoutAction } from "@/app/actions/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Visão geral",  href: "/dashboard" },
  { icon: Store,           label: "Minha loja",   href: "/dashboard/loja" },
  { icon: Package,         label: "Produtos",      href: "/dashboard/produtos" },
  { icon: ShoppingBag,     label: "Pedidos",       href: "/dashboard/pedidos" },
];

interface DashboardHeaderProps {
  title: string;
  currentPath: string;
  user: {
    name: string;
    email: string;
    store: { id: string; slug: string; name: string } | null;
  };
}

export default function DashboardHeader({ title, currentPath, user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-400 text-sm hover:bg-gray-100 transition-colors">
            <Search className="w-4 h-4" />
            <span>Buscar...</span>
          </button>

          <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* Avatar + menu do usuário */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-none">{user.name.split(" ")[0]}</p>
                {user.store && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-none">{user.store.name}</p>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-20">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                  </div>
                  {user.store && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_STORE_URL ?? "https://vendflow-store.vercel.app"}/${user.store.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Store className="w-4 h-4 text-gray-400" />
                      Ver minha loja
                    </a>
                  )}
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" fill="white" />
                </div>
                <span className="text-white font-bold">Vendflow</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info do usuário mobile */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-white/80 text-sm font-semibold">{user.name}</p>
              <p className="text-white/40 text-xs mt-0.5">{user.store?.name ?? user.email}</p>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "sidebar-item",
                    currentPath === href ? "sidebar-item-active" : "sidebar-item-inactive"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </a>
              ))}
            </nav>

            <div className="p-3 border-t border-white/5">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="sidebar-item text-red-400/60 hover:bg-red-500/10 hover:text-red-400 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
