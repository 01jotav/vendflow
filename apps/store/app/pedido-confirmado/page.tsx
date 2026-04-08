import { CheckCircle, Package, MessageCircle, ArrowRight, Copy } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { store, products } from "@/lib/mock-store";

const orderItems = [
  { ...products[0], quantity: 1 },
  { ...products[1], quantity: 2 },
];

const orderId = "#" + Math.floor(10000 + Math.random() * 90000);
const total = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

const steps = [
  { label: "Pedido confirmado",  done: true,  active: false },
  { label: "Pagamento aprovado", done: false,  active: true },
  { label: "Em separação",       done: false,  active: false },
  { label: "Enviado",            done: false,  active: false },
  { label: "Entregue",           done: false,  active: false },
];

export default function OrderConfirmedPage() {
  return (
    <>
      <StoreHeader cartCount={0} />

      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          {/* Sucesso */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ backgroundColor: `${store.themeColor}20` }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: store.themeColor }} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pedido realizado!</h1>
            <p className="text-gray-500">
              Obrigada pela compra! Você receberá as atualizações no seu WhatsApp. 🎉
            </p>
          </div>

          {/* Card do pedido */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            {/* Número do pedido */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Número do pedido</p>
                <p className="text-xl font-extrabold text-gray-900 font-mono">{orderId}</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
            </div>

            {/* Itens */}
            <div className="space-y-3 mb-5">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${item.images[0]} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900">Total pago</span>
              <span className="text-xl font-extrabold" style={{ color: store.themeColor }}>
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Rastreamento */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5" style={{ color: store.themeColor }} />
              <h2 className="font-bold text-gray-900">Acompanhe seu pedido</h2>
            </div>
            <div className="relative">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 mb-3 last:mb-0">
                  {/* Linha conectora */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        step.done
                          ? "text-white"
                          : step.active
                          ? "border-2 bg-white"
                          : "bg-gray-100 border-2 border-gray-200"
                      }`}
                      style={
                        step.done
                          ? { backgroundColor: store.themeColor }
                          : step.active
                          ? { borderColor: store.themeColor }
                          : {}
                      }
                    >
                      {step.done ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : step.active ? (
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: store.themeColor }} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-0.5 h-5 mt-0.5 ${step.done ? "" : "bg-gray-200"}`}
                        style={step.done ? { backgroundColor: store.themeColor } : {}} />
                    )}
                  </div>
                  <span className={`text-sm ${step.done || step.active ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                    {step.active && (
                      <span className="ml-2 text-xs font-normal text-gray-400">· Aguardando</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-800 text-sm">Confirmação enviada no WhatsApp</p>
              <p className="text-xs text-green-600 mt-0.5">
                Você receberá atualizações automáticas sobre o status do seu pedido.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: store.themeColor }}
            >
              Continuar comprando
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              Falar com a loja
            </a>
          </div>
        </div>
      </main>

      <StoreFooter />
    </>
  );
}
