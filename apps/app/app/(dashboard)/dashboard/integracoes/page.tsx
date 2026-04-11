import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { Webhook, Zap, Lock } from "lucide-react";
import WebhookForm from "./WebhookForm";

export default async function IntegracoesPage() {
  const session = await auth();
  const storeId = session?.user?.store?.id;

  const store = storeId
    ? await db.store.findUnique({
        where: { id: storeId },
        select: { plan: true, webhookUrl: true },
      })
    : null;

  const isPro = store?.plan === "PRO";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Integrações</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Conecte sua loja a ferramentas externas como n8n, Make ou Zapier.
        </p>
      </div>

      {/* Plano atual */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Plano atual: <span className={isPro ? "text-violet-600" : "text-gray-500"}>{store?.plan ?? "BASIC"}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPro
                ? "Você tem acesso a todas as integrações."
                : "Atualize para o plano PRO para desbloquear webhooks."}
            </p>
          </div>
        </div>
      </div>

      {/* Webhook config */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Webhook className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Webhook de Pedidos</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Receba notificações em tempo real quando um pedido for pago. O Vendflow enviará um POST com os dados do pedido para a URL configurada.
            </p>
          </div>
        </div>

        {!isPro && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              Disponível apenas no plano PRO.
            </p>
          </div>
        )}

        <WebhookForm currentUrl={store?.webhookUrl ?? ""} disabled={!isPro} />

        {/* Exemplo de payload */}
        <details className="group">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
            Ver exemplo de payload
          </summary>
          <pre className="mt-3 p-4 rounded-xl bg-gray-900 text-gray-100 text-xs overflow-x-auto">
{JSON.stringify({
  event: "order.paid",
  timestamp: new Date().toISOString(),
  data: {
    id: "ORD-98765",
    status: "paid",
    total: 250.50,
    customer: { name: "João Silva", phone: "+55 11 99999-8888", email: "joao@email.com" },
    items: [{ product: "Shampoo Premium", quantity: 2, price: 89.90 }, { product: "Condicionador", quantity: 1, price: 70.70 }],
  },
}, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
