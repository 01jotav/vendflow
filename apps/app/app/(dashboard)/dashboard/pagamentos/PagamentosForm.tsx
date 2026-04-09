"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Check, AlertCircle, ExternalLink } from "lucide-react";

interface PagamentosFormProps {
  initial: {
    publicKey: string;
    liveMode: boolean;
    mpUserId: string | null;
    updatedAt: Date;
  } | null;
}

export default function PagamentosForm({ initial }: PagamentosFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/mercadopago/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: fd.get("accessToken"),
        publicKey: fd.get("publicKey"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erro ao salvar");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  async function disconnect() {
    if (!confirm("Tem certeza? Sua loja não poderá mais receber pagamentos até reconectar.")) return;
    setLoading(true);
    await fetch("/api/mercadopago/config", { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  const connected = !!initial;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Pagamentos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Conecte sua conta Mercado Pago para receber pagamentos direto na sua conta.
        </p>
      </div>

      {connected && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">Mercado Pago conectado</p>
            <p className="text-xs text-green-700 mt-0.5">
              Modo {initial.liveMode ? "produção" : "teste"} · Atualizado em{" "}
              {new Date(initial.updatedAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <button
            type="button"
            onClick={disconnect}
            disabled={loading}
            className="text-xs text-red-600 font-semibold hover:underline disabled:opacity-50"
          >
            Desconectar
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Credenciais Mercado Pago</p>
            <p className="text-xs text-gray-500">Cole abaixo suas credenciais do painel MP</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-semibold mb-1">Como obter suas credenciais:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
              <li>Acesse o painel do Mercado Pago Developers</li>
              <li>Crie uma aplicação (tipo Checkout Pro)</li>
              <li>Copie o <strong>Access Token</strong> e <strong>Public Key</strong></li>
            </ol>
            <a
              href="https://www.mercadopago.com.br/developers/panel/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 font-semibold hover:underline"
            >
              Abrir painel MP <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Access Token</label>
            <input
              name="accessToken"
              type="password"
              required
              placeholder={connected ? "••••••••• (atualizar)" : "APP_USR-..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <p className="text-xs text-gray-400 mt-1">Começa com <code>APP_USR-</code> (produção) ou <code>TEST-</code> (teste)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Public Key</label>
            <input
              name="publicKey"
              type="text"
              required
              defaultValue={initial?.publicKey ?? ""}
              placeholder="APP_USR-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2">{error}</div>
          )}
          {success && (
            <div className="rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm px-3 py-2">
              Credenciais salvas e validadas com sucesso.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? "Validando..." : connected ? "Atualizar credenciais" : "Conectar Mercado Pago"}
          </button>
        </form>
      </div>
    </div>
  );
}
