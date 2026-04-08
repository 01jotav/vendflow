"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import clsx from "clsx";

export interface StoreHeaderData {
  slug: string;
  name: string;
  themeColor: string;
  logoInitial: string;
}

interface StoreHeaderProps {
  store: StoreHeaderData;
  categories?: string[];
  cartCount?: number;
}

export default function StoreHeader({ store, categories = [], cartCount = 0 }: StoreHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const homeHref = `/${store.slug}`;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href={homeHref} className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform"
              style={{ backgroundColor: store.themeColor }}
            >
              {store.logoInitial}
            </div>
            <span className="font-bold text-gray-900 text-lg">{store.name}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`${homeHref}?categoria=${encodeURIComponent(cat.toLowerCase())}`}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                {cat}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors hidden sm:flex">
              <Search className="w-5 h-5" />
            </button>

            <a
              href={`${homeHref}/carrinho`}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: store.themeColor }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-bold text-gray-900">{store.name}</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            <a href={homeHref} className="py-3 px-3 rounded-xl font-semibold text-gray-900 hover:bg-gray-50">
              Todos os produtos
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`${homeHref}?categoria=${encodeURIComponent(cat.toLowerCase())}`}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium"
              >
                {cat}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
