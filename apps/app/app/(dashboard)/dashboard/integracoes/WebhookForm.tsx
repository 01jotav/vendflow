"use client";

import { useActionState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { updateWebhookAction } from "@/app/actions/store";

interface Props {
  currentUrl: string;
  disabled: boolean;
}

export default function WebhookForm({ currentUrl, disabled }: Props) {
  const [state, action, isPending] = useActionState(updateWebhookAction, null);

  return (
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
    </form>
  );
}
