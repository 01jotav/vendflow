"use client";

import { useState } from "react";
import {
  Crown,
  Zap,
  Webhook,
  HeadphonesIcon,
  Sparkles,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Check,
} from "lucide-react";
import clsx from "clsx";

interface Props {
  plan: "BASIC" | "PRO";
  hasSubscription: boolean;
}

const proFeatures = [
  { icon: Webhook, label: "Webhooks automáticos", desc: "Integre com n8n, Make, Zapier e receba eventos em tempo real" },
  { icon: Zap, label: "Notificações via WhatsApp", desc: "Dispare mensagens automáticas para clientes via webhook" },
  { icon: HeadphonesIcon, label: "Suporte prioritário", desc: "Atendimento dedicado com tempo de resposta reduzido" },
  { icon: Sparkles, label: "Recursos exclusivos", desc: "Acesso antecipado a novas funcionalidades da plataforma" },
  { icon: ShieldCheck, label: "Relatórios avançados", desc: "Analytics detalhados sobre vendas e comportamento" },
];

export default function BillingClient({ plan, hasSubscription }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Erro ao iniciar checkout");
        setLoading(false);
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Erro ao abrir portal");
        setLoading(false);
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  const isPro = plan === "PRO";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Assinatura</h2>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie seu plano e forma de pagamento.</p>
      </div>

      {/* Plano atual */}
      <div
        className={clsx(
          "rounded-2xl border p-6",
          isPro
            ? "bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200"
            : "bg-white border-gray-100 shadow-sm"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isPro ? "bg-gradient-brand" : "bg-gray-100"
              )}
            >
              <Crown className={clsx("w-6 h-6", isPro ? "text-white" : "text-gray-400")} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Plano {plan}</h3>
                {isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {isPro
                  ? "Você tem acesso a todos os recursos da plataforma."
                  : "Faça upgrade para desbloquear recursos avançados."}
              </p>
            </div>
          </div>
        </div>

        {isPro && hasSubscription && (
          <button
            onClick={handlePortal}
            disabled={loading}
            className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Gerenciar assinatura
          </button>
        )}
      </div>

      {/* Card PRO — visível apenas para BASIC */}
      {!isPro && (
        <div className="relative rounded-2xl border-2 border-primary-300 bg-white shadow-xl shadow-primary-500/10 overflow-hidden">
          {/* Ribbon */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-gradient-brand text-white text-xs font-bold shadow-lg">
              RECOMENDADO
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Vendflow PRO</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Desbloqueie o potencial máximo da sua loja com automações e integrações avançadas.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {proFeatures.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                      {label}
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-brand text-white font-bold shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Redirecionando...</>
              ) : (
                <><Crown className="w-5 h-5" /> Fazer upgrade para PRO</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* FAQ rápido */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">Perguntas frequentes</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">Posso cancelar a qualquer momento?</p>
            <p className="text-gray-500">Sim. Cancele pelo portal de assinatura sem nenhuma taxa adicional.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">O que acontece se eu cancelar?</p>
            <p className="text-gray-500">Seu plano volta para BASIC ao final do período já pago. Seus dados são mantidos.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Qual a forma de pagamento?</p>
            <p className="text-gray-500">Cartão de crédito internacional via Stripe. Pagamento seguro e criptografado.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
