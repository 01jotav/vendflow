"use client";

import { useState } from "react";
import { Check, AlertCircle, Save, RefreshCw, Zap } from "lucide-react";
import clsx from "clsx";

const automations = [
  {
    id: "order_confirmed",
    title: "Pedido confirmado",
    description: "Enviada assim que o pagamento é aprovado.",
    defaultMsg: "Olá {nome}! 🎉 Seu pedido {id} foi confirmado! Valor: R$ {valor}. Em breve entraremos em contato com o rastreio.",
    active: true,
  },
  {
    id: "order_shipped",
    title: "Pedido enviado",
    description: "Enviada quando você marca o pedido como enviado.",
    defaultMsg: "Oi {nome}! 📦 Seu pedido {id} saiu para entrega! Rastreio: {rastreio}. Qualquer dúvida estamos aqui!",
    active: true,
  },
  {
    id: "order_delivered",
    title: "Pedido entregue",
    description: "Enviada após confirmação de entrega.",
    defaultMsg: "Que ótimo {nome}! ✅ Seu pedido chegou! Esperamos que ame os produtos. Avalie sua experiência: {link}",
    active: false,
  },
  {
    id: "abandoned_cart",
    title: "Carrinho abandonado",
    description: "Lembrete enviado 1h após abandono do carrinho.",
    defaultMsg: "Ei {nome}! 👀 Você deixou alguns produtos no carrinho. Ainda quer garantir? {link}",
    active: false,
  },
];

export default function WhatsappPage() {
  const [connected, setConnected] = useState(false);
  const [msgs, setMsgs] = useState(
    Object.fromEntries(automations.map((a) => [a.id, a.defaultMsg]))
  );
  const [actives, setActives] = useState(
    Object.fromEntries(automations.map((a) => [a.id, a.active]))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">WhatsApp</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure mensagens automáticas para seus clientes.
        </p>
      </div>

      {/* Status de conexão */}
      <div className={clsx(
        "rounded-2xl border-2 p-5",
        connected ? "border-green-200 bg-green-50" : "border-dashed border-gray-200 bg-white"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
              connected ? "bg-green-500" : "bg-gray-100"
            )}>
              <svg className={clsx("w-6 h-6", connected ? "text-white" : "text-gray-400")} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">
                {connected ? "WhatsApp conectado" : "WhatsApp não conectado"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {connected
                  ? "+55 (11) 99999-0000 · Evolution API"
                  : "Conecte seu WhatsApp para enviar mensagens automáticas."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setConnected(!connected)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all",
              connected
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-gradient-brand text-white shadow-lg shadow-primary-500/30 hover:scale-105"
            )}
          >
            {connected ? (
              <><RefreshCw className="w-4 h-4" /> Desconectar</>
            ) : (
              <><Zap className="w-4 h-4" /> Conectar</>
            )}
          </button>
        </div>

        {/* QR Code mockup */}
        {!connected && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Ao clicar em <strong>Conectar</strong>, um QR Code será gerado. Escaneie com o WhatsApp do número que receberá as mensagens automáticas.
            </p>
          </div>
        )}
      </div>

      {/* Automações */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Mensagens automáticas</h3>
        <p className="text-sm text-gray-500 -mt-2">
          Use as variáveis: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{"{nome}"}</code>{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{"{id}"}</code>{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{"{valor}"}</code>{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{"{rastreio}"}</code>{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{"{link}"}</code>
        </p>

        {automations.map((automation) => (
          <div key={automation.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold text-gray-900">{automation.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{automation.description}</p>
              </div>
              <button
                onClick={() => setActives((prev) => ({ ...prev, [automation.id]: !prev[automation.id] }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${actives[automation.id] ? "bg-primary-500" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${actives[automation.id] ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
            <textarea
              rows={3}
              value={msgs[automation.id]}
              onChange={(e) => setMsgs((prev) => ({ ...prev, [automation.id]: e.target.value }))}
              disabled={!actives[automation.id]}
              className={clsx(
                "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none",
                actives[automation.id]
                  ? "border-gray-200 bg-white text-gray-700"
                  : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
              )}
            />
          </div>
        ))}
      </div>

      {/* Salvar */}
      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all">
        <Save className="w-4 h-4" />
        Salvar configurações
      </button>
    </div>
  );
}
