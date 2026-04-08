"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import clsx from "clsx";
import { APP_URL } from "@/lib/urls";

const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Temas", href: "#themes" },
  { label: "Planos", href: "#pricing" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span
              className={clsx(
                "text-xl font-bold transition-colors",
                isScrolled ? "text-gray-900" : "text-white"
              )}
            >
              Vendflow
            </span>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  isScrolled ? "text-gray-600" : "text-white/90"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`${APP_URL}/login`}
              className={clsx(
                "text-sm font-medium px-4 py-2 rounded-lg transition-colors",
                isScrolled
                  ? "text-gray-700 hover:text-primary-600"
                  : "text-white/90 hover:text-white"
              )}
            >
              Entrar
            </a>
            <a
              href={`${APP_URL}/cadastro`}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-brand text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all"
            >
              Começar grátis
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={clsx(
              "lg:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "text-gray-700" : "text-white"
            )}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-4 px-4 sm:px-6">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
              <a
                href={`${APP_URL}/login`}
                className="text-center text-sm font-medium text-gray-700 py-2.5 px-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                Entrar
              </a>
              <a
                href={`${APP_URL}/cadastro`}
                className="text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-gradient-brand text-white shadow-lg"
              >
                Começar grátis
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
