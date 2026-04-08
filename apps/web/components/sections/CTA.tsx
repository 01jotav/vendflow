import { ArrowRight, Sparkles } from "lucide-react";
import { APP_URL } from "@/lib/urls";

export default function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-dark relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-sm text-white/70 font-medium">
              14 dias grátis, sem cartão de crédito
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Pronta para transformar
            <br />
            <span className="gradient-text">suas vendas?</span>
          </h2>

          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Junte-se a mais de 2.400 lojistas que já criaram sua loja de cosméticos online com o Vendflow.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${APP_URL}/cadastro`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-brand text-white shadow-xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 transition-all"
            >
              Criar minha loja grátis
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
            >
              Ver planos e preços
            </a>
          </div>

          {/* Garantia */}
          <p className="text-white/30 text-sm mt-8">
            Sem contrato de fidelidade · Cancele a qualquer momento · Suporte em português
          </p>
        </div>
      </div>
    </section>
  );
}
