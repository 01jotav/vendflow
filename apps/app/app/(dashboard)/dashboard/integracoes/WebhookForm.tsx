"use client";

import { useActionState, useState, useTransition } from "react";
import { Loader2, Check, AlertCircle, Send, X } from "lucide-react";
import { updateWebhookAction, testWebhookAction } from "@/app/actions/store";

interface Props {
  currentUrl: string;
  disabled: boolean;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function WebhookForm({ currentUrl, disabled }: Props) {
  const [state, action, isPending] = useActionState(updateWebhookAction, null);
  const [testing, startTest] = useTransition();
  const [toast, setToast] = useState<Toast | null>(null);

  const handleTest = () => {
    startTest(async () => {
      const result = await testWebhookAction();
      setToast({
        type: result.success ? "success" : "error",
        message: result.message ?? "Erro desconhecido",
      });
      setTimeout(() => setToast(null), 5000);
    });
  };

  return (
    <>
      <form action={action} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            URL do Webhook
          </label>
          <input
            name="webhookUrl"
            type="url"
            defaultValue={currentUrl}
            placeholder="https://seu-n8n.com/webhook/vendflow"
            disabled={disabled || isPending}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        {state?.message && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
              state.success
                ? "bg-green-50 border border-green-100 text-green-700"
                : "bg-red-50 border border-red-100 text-red-700"
            }`}
          >
            {state.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {state.message}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={disabled || isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
            ) : (
              "Salvar webhook"
            )}
          </button>

          <button
            type="button"
            onClick={handleTest}
            disabled={disabled || testing || !currentUrl}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {testing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Testando...</>
            ) : (
              <><Send className="w-4 h-4" /> Testar conexão</>
            )}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
