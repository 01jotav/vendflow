"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, QrCode, CreditCard, FileText } from "lucide-react";
import StoreHeader from "@/components/layout/StoreHeader";
import { store, products } from "@/lib/mock-store";

const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[1], quantity: 2 },
];

const paymentMethods = [
  { id: "pix",    label: "PIX",            icon: QrCode,     desc: "Aprovação imediata" },
  { id: "card",   label: "Cartão",         icon: CreditCard, desc: "Até 3x sem juros" },
  { id: "boleto", label: "Boleto",         icon: FileText,   desc: "Vence em 3 dias úteis" },
];

export default function CheckoutPage() {
  const [payment, setPayment] = useState("pix");
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 18.9;
  const total = subtotal + shipping;

  return (
    <>
      <StoreHeader cartCount={cartItems.length} />

      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <a href="/carrinho" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-extrabold text-gray-900">Finalizar compra</h1>
            <div className="flex items-center gap-1.5 ml-auto text-sm text-gray-400">
              <Lock className="w-4 h-4 text-green-500" />
              Compra segura
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulário */}
            <div className="lg:col-span-2 space-y-4">
              {/* Dados pessoais */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="font-bold text-gray-900">Seus dados</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                    <input type="text" placeholder="Maria Silva" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" style={{ "--tw-ring-color": store.themeColor } as React.CSSProperties} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                    <input type="email" placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
                    <input type="tel" placeholder="(11) 99999-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                    <input type="text" placeholder="000.000.000-00" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="font-bold text-gray-900">Endereço de entrega</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CEP</label>
                    <input type="text" placeholder="00000-000" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                  <input type="text" placeholder="Rua, Avenida..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Número</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Complemento</label>
                    <input type="text" placeholder="Apto, Bloco... (opcional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bairro</label>
                    <input type="text" placeholder="Centro" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade / Estado</label>
                    <input type="text" placeholder="São Paulo / SP" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="font-bold text-gray-900">Forma de pagamento</h2>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPayment(method.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                          payment === method.id ? "border-opacity-100" : "border-gray-100 hover:border-gray-300"
                        }`}
                        style={payment === method.id ? { borderColor: store.themeColor, backgroundColor: `${store.themeColor}10` } : {}}
                      >
                        <Icon className="w-5 h-5" style={payment === method.id ? { color: store.themeColor } : { color: "#9ca3af" }} />
                        <span className="text-xs font-bold text-gray-900">{method.label}</span>
                        <span className="text-xs text-gray-400">{method.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* PIX */}
                {payment === "pix" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <QrCode className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-800">QR Code gerado após confirmar o pedido</p>
                    <p className="text-xs text-green-600 mt-0.5">Aprovação instantânea</p>
                  </div>
                )}

                {/* Cartão */}
                {payment === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Número do cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Validade</label>
                        <input type="text" placeholder="MM/AA" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                        <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome no cartão</label>
                      <input type="text" placeholder="MARIA A SILVA" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Boleto */}
                {payment === "boleto" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-600">O boleto será gerado após confirmar o pedido. O prazo de compensação é de até 3 dias úteis.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
                <h2 className="font-bold text-gray-900 mb-4">Resumo</h2>

                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-lg ${item.images[0]} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Frete</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                    <span>Total</span>
                    <span style={{ color: store.themeColor }}>
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                <a
                  href="/pedido-confirmado"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: store.themeColor }}
                >
                  <Lock className="w-4 h-4" />
                  Confirmar pedido
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
