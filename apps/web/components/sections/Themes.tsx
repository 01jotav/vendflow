"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

const themes = [
  {
    id: "modern",
    label: "Modern",
    emoji: "⚡",
    description: "Limpo, minimalista e sofisticado. Ideal para marcas premium.",
    accent: "#7c3aed",
    bg: "bg-gradient-to-br from-slate-900 to-slate-800",
    cardBg: "bg-slate-800",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    buttonBg: "bg-violet-600",
    badgeColors: ["bg-violet-500", "bg-violet-600", "bg-violet-700"],
    borderColor: "border-violet-500",
  },
  {
    id: "young",
    label: "Young",
    emoji: "✨",
    description: "Vibrante, colorido e animado. Perfeito para o público jovem.",
    accent: "#ec4899",
    bg: "bg-gradient-to-br from-pink-50 to-purple-50",
    cardBg: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-400",
    buttonBg: "bg-gradient-to-r from-pink-500 to-violet-500",
    badgeColors: ["bg-pink-400", "bg-purple-400", "bg-violet-400"],
    borderColor: "border-pink-400",
  },
  {
    id: "elegant",
    label: "Elegant",
    emoji: "👑",
    description: "Dourado e refinado. Para marcas de luxo e alto padrão.",
    accent: "#b45309",
    bg: "bg-gradient-to-br from-amber-950 to-stone-900",
    cardBg: "bg-stone-800",
    textPrimary: "text-amber-100",
    textSecondary: "text-amber-300/50",
    buttonBg: "bg-gradient-to-r from-amber-600 to-yellow-500",
    badgeColors: ["bg-amber-600", "bg-yellow-600", "bg-amber-700"],
    borderColor: "border-amber-500",
  },
  {
    id: "minimal",
    label: "Minimal",
    emoji: "○",
    description: "Ultra limpo em preto e branco. Design que fala por si só.",
    accent: "#111827",
    bg: "bg-white",
    cardBg: "bg-gray-50",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-400",
    buttonBg: "bg-gray-900",
    badgeColors: ["bg-gray-200", "bg-gray-300", "bg-gray-400"],
    borderColor: "border-gray-900",
  },
];

const mockProducts = ["Sérum Facial", "Máscara Capilar", "Base Mate"];

export default function Themes() {
  const [active, setActive] = useState("modern");
  const selected = themes.find((t) => t.id === active)!;

  return (
    <section id="themes" className="py-20 lg:py-28 bg-white">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Temas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            4 estilos,{" "}
            <span className="gradient-text-soft">infinitas possibilidades</span>
          </h2>
          <p className="text-lg text-gray-500">
            Cada tema é pensado para um tipo de negócio. Escolha o que combina
            com a sua marca e personalize com suas cores.
          </p>
        </div>

        {/* Seletor de temas */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActive(theme.id)}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                active === theme.id
                  ? "bg-gray-900 text-white border-gray-900 scale-105 shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              )}
            >
              <span>{theme.emoji}</span>
              {theme.label}
              {active === theme.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Preview do tema */}
        <div className="max-w-4xl mx-auto">
          <div className={clsx("rounded-3xl overflow-hidden shadow-2xl transition-all duration-500", selected.bg)}>
            {/* Topbar da loja */}
            <div className={clsx("px-6 py-4 flex items-center justify-between border-b", `border-white/10`)}>
              <div className="flex items-center gap-2">
                <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white", selected.buttonBg)}>
                  B
                </div>
                <span className={clsx("font-bold text-sm", selected.textPrimary)}>
                  Bella Cosméticos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx("text-xs", selected.textSecondary)}>Início</span>
                <span className={clsx("text-xs", selected.textSecondary)}>Produtos</span>
                <span className={clsx("text-xs", selected.textSecondary)}>Sobre</span>
                <div className={clsx("px-3 py-1 rounded-lg text-xs font-semibold text-white", selected.buttonBg)}>
                  Carrinho (2)
                </div>
              </div>
            </div>

            {/* Conteúdo da loja */}
            <div className="p-6 lg:p-10">
              {/* Banner */}
              <div className={clsx("rounded-2xl p-8 mb-6 text-center", `border-2`, selected.borderColor, `border-dashed opacity-30`)}>
                <p className={clsx("text-sm", selected.textSecondary)}>Banner da loja</p>
              </div>

              {/* Produtos */}
              <p className={clsx("text-xs font-semibold uppercase tracking-wider mb-4", selected.textSecondary)}>
                Produtos em destaque
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {mockProducts.map((product, i) => (
                  <div key={product} className={clsx("rounded-xl overflow-hidden", selected.cardBg, "shadow-sm")}>
                    <div className={clsx("h-24 sm:h-32", selected.badgeColors[i])} />
                    <div className="p-3">
                      <p className={clsx("text-xs font-semibold mb-1", selected.textPrimary)}>
                        {product}
                      </p>
                      <p className={clsx("text-xs mb-2", selected.textSecondary)}>
                        R$ {(49 + i * 20).toFixed(2).replace(".", ",")}
                      </p>
                      <button
                        className={clsx(
                          "w-full py-1.5 rounded-lg text-xs font-semibold text-white",
                          selected.buttonBg
                        )}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info do tema */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">{selected.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
