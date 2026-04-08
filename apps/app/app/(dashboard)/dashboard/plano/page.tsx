import { Check, Zap, ArrowRight, CreditCard } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 49,
    current: false,
    features: ["50 produtos", "1 tema", "Pagamentos online", "Suporte e-mail"],
  },
  {
    name: "Pro",
    price: 99,
    current: true,
    features: ["200 produtos", "4 temas", "Pagamentos online", "WhatsApp automático", "Relatórios", "Suporte chat"],
  },
  {
    name: "Premium",
    price: 199,
    current: false,
    features: ["Ilimitado", "4 temas", "Pagamentos online", "WhatsApp avançado", "Relatórios completos", "Domínio próprio", "Suporte VIP 24/7"],
  },
];

export default function PlanoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Meu plano</h2>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie sua assinatura do Vendflow.</p>
      </div>

      {/* Plano atual */}
      <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Plano atual</p>
            <p className="text-3xl font-extrabold">Pro</p>
            <p className="text-white/60 text-sm mt-1">Próxima cobrança: 07/05/2025 · R$ 99,00</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Ativo
          </div>
          <span className="text-white/50 text-sm">·</span>
          <span className="text-white/60 text-sm">Renova automaticamente</span>
        </div>
      </div>

      {/* Comparação de planos */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900">Alterar plano</h3>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl border-2 p-5 flex items-center justify-between gap-4 transition-all ${
              plan.current ? "border-primary-400 shadow-sm shadow-primary-100" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-gray-900">{plan.name}</p>
                  {plan.current && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                      Atual
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {plan.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs text-gray-500">
                      <Check className="w-3 h-3 text-primary-500" strokeWidth={3} />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xl font-extrabold text-gray-900">R$ {plan.price}</p>
                <p className="text-xs text-gray-400">/mês</p>
              </div>
              {!plan.current && (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
                  {plan.price > 99 ? "Fazer upgrade" : "Fazer downgrade"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagamento */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Forma de pagamento</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mastercard •••• 4242</p>
              <p className="text-xs text-gray-400">Expira 12/2027</p>
            </div>
          </div>
          <button className="text-sm text-primary-600 font-medium hover:underline">
            Alterar
          </button>
        </div>
      </div>

      {/* Cancelar */}
      <div className="text-center pb-4">
        <button className="text-sm text-red-400 hover:text-red-600 transition-colors">
          Cancelar assinatura
        </button>
      </div>
    </div>
  );
}
