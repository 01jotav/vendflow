"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import clsx from "clsx";
import { APP_URL } from "@/lib/urls";

const plans = [
  {
    name: "Starter",
    emoji: "🌱",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "Perfeito para quem está começando agora.",
    cta: "Começar grátis",
    highlighted: false,
    features: [
      "Até 50 produtos",
      "1 tema disponível",
      "Pagamentos online (PIX e cartão)",
      "Link de loja personalizado",
      "Suporte via e-mail",
      "SSL gratuito",
    ],
    missing: ["Múltiplos temas", "Relatórios avançados"],
  },
  {
    name: "Pro",
    emoji: "🚀",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Para lojistas que querem crescer de verdade.",
    cta: "Começar grátis",
    highlighted: true,
    badge: "Mais popular",
    features: [
      "Até 200 produtos",
      "Todos os 4 temas",
      "Pagamentos online (PIX, cartão e boleto)",
      "Link de loja personalizado",
      "Gestão de pedidos completa",
      "Relatórios de vendas",
      "Suporte prioritário via chat",
      "SSL gratuito",
    ],
    missing: ["Domínio próprio"],
  },
  {
    name: "Premium",
    emoji: "👑",
    monthlyPrice: 199,
    yearlyPrice: 159,
    description: "Para negócios consolidados sem limites.",
    cta: "Falar com vendas",
    highlighted: false,
    features: [
      "Produtos ilimitados",
      "Todos os 4 temas",
      "Pagamentos online completos",
      "Domínio próprio",
      "Integrações avançadas",
      "Relatórios completos e exportáveis",
      "Suporte VIP 24/7",
      "SSL gratuito",
      "Múltiplos usuários por conta",
    ],
    missing: [],
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Planos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Preço justo para{" "}
            <span className="gradient-text-soft">cada fase</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>

          {/* Toggle mensal/anual */}
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                !isYearly ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                isYearly ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Anual
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards de planos */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                "relative rounded-2xl p-7 flex flex-col transition-all duration-300",
                plan.highlighted
                  ? "bg-gradient-dark text-white shadow-2xl shadow-primary-900/40 scale-105 z-10"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-100"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-brand px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                    <Zap className="w-3 h-3" fill="white" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header do plano */}
              <div className="mb-6">
                <span className="text-2xl mb-2 block">{plan.emoji}</span>
                <h3
                  className={clsx(
                    "text-xl font-bold mb-1",
                    plan.highlighted ? "text-white" : "text-gray-900"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={clsx(
                    "text-sm",
                    plan.highlighted ? "text-white/60" : "text-gray-500"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              {/* Preço */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span
                    className={clsx(
                      "text-4xl font-extrabold",
                      plan.highlighted ? "text-white" : "text-gray-900"
                    )}
                  >
                    R${" "}
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span
                    className={clsx(
                      "text-sm pb-1",
                      plan.highlighted ? "text-white/50" : "text-gray-400"
                    )}
                  >
                    /mês
                  </span>
                </div>
                {isYearly && (
                  <p
                    className={clsx(
                      "text-xs mt-1",
                      plan.highlighted ? "text-green-400" : "text-green-600"
                    )}
                  >
                    Cobrado R$ {plan.yearlyPrice * 12}/ano — economia de R${" "}
                    {(plan.monthlyPrice - plan.yearlyPrice) * 12}
                  </p>
                )}
              </div>

              {/* CTA */}
              <a
                href={
                  plan.name === "Premium"
                    ? "#"
                    : `${APP_URL}/cadastro`
                }
                className={clsx(
                  "block text-center py-3 rounded-xl text-sm font-bold mb-6 transition-all",
                  plan.highlighted
                    ? "bg-gradient-brand text-white shadow-lg shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {plan.cta}
              </a>

              {/* Divisor */}
              <div
                className={clsx(
                  "border-t mb-5",
                  plan.highlighted ? "border-white/10" : "border-gray-100"
                )}
              />

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <div
                      className={clsx(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        plan.highlighted ? "bg-primary-500" : "bg-primary-100"
                      )}
                    >
                      <Check
                        className={clsx(
                          "w-2.5 h-2.5",
                          plan.highlighted ? "text-white" : "text-primary-600"
                        )}
                        strokeWidth={3}
                      />
                    </div>
                    <span className={plan.highlighted ? "text-white/80" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Nota */}
        <p className="text-center text-sm text-gray-400 mt-10">
          Todos os planos incluem 14 dias grátis. Após o período, escolha o melhor para o seu negócio.
        </p>
      </div>
    </section>
  );
}
