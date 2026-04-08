"use client";

import { useActionState, useState } from "react";
import { Check, Save, ExternalLink, Copy } from "lucide-react";
import clsx from "clsx";
import { updateStoreAction } from "@/app/actions/store";

const themes = [
  { id: "MODERN",  label: "Modern",  emoji: "⚡", desc: "Limpo e sofisticado" },
  { id: "YOUNG",   label: "Young",   emoji: "✨", desc: "Vibrante e jovem" },
  { id: "ELEGANT", label: "Elegant", emoji: "👑", desc: "Luxuoso e refinado" },
  { id: "MINIMAL", label: "Minimal", emoji: "○",  desc: "Ultra minimalista" },
];

const presetColors = [
  "#7c3aed", "#ec4899", "#2563eb", "#16a34a",
  "#ea580c", "#dc2626", "#0891b2", "#111827",
];

interface Store {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  themeColor: string;
  theme: string;
}

export default function LojaForm({ store }: { store: Store }) {
  const [selectedTheme, setSelectedTheme] = useState(store.theme);
  const [themeColor, setThemeColor] = useState(store.themeColor);
  const [copied, setCopied] = useState(false);
  const [state, action, pending] = useActionState(updateStoreAction, {});

  const storeBase = process.env.NEXT_PUBLIC_STORE_URL ?? "https://vendflow-store.vercel.app";
  const storeUrl = `${storeBase}/${store.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form action={action}>
      {/* hidden inputs para os campos controlados */}
      <input type="hidden" name="theme" value={selectedTheme} />
      <input type="hidden" name="themeColor" value={themeColor} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Configurações da loja</h2>
            <p className="text-sm text-gray-500 mt-0.5">Personalize a aparência da sua loja.</p>
          </div>
          <button
            type="submit"
            disabled={pending}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60",
              state.success
                ? "bg-green-500 text-white"
                : "bg-gradient-brand text-white shadow-lg shadow-primary-500/30 hover:scale-105"
            )}
          >
            {state.success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {pending ? "Salvando..." : state.success ? "Salvo!" : "Salvar"}
          </button>
        </div>

        {state.message && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{state.message}</p>
        )}

        {/* URL da loja */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Link da sua loja</h3>
          <p className="text-sm text-gray-400 mb-3">Compartilhe esse link com seus clientes.</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-700 flex-1 truncate">{storeUrl}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:text-primary-700 flex-shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
            <a
              href={`https://${storeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir
            </a>
          </div>
        </div>

        {/* Dados básicos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Dados da loja</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da loja</label>
              <input
                name="name"
                type="text"
                defaultValue={store.name}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL da loja (slug)</label>
              <div className="flex">
                <span className="px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 flex-shrink-0">
                  loja/
                </span>
                <input
                  type="text"
                  value={store.slug}
                  readOnly
                  className="flex-1 px-3 py-3 rounded-r-xl border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">O slug não pode ser alterado.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição da loja</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={store.description ?? ""}
              placeholder="Descreva sua loja para seus clientes..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Cor tema */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Cor principal</h3>
          <p className="text-sm text-gray-400 mb-4">Usada em botões e destaques da sua loja.</p>
          <div className="flex items-center gap-3 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setThemeColor(color)}
                style={{ backgroundColor: color }}
                className={clsx(
                  "w-9 h-9 rounded-xl transition-transform hover:scale-110",
                  themeColor === color && "ring-2 ring-offset-2 ring-gray-400 scale-110"
                )}
              />
            ))}
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-9 h-9 rounded-xl cursor-pointer border border-gray-200"
              />
              Personalizada
            </label>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <span className="text-sm text-gray-500">Preview do botão:</span>
            <button type="button" className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: themeColor }}>
              Comprar agora
            </button>
          </div>
        </div>

        {/* Tema */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Tema da loja</h3>
          <p className="text-sm text-gray-400 mb-4">Define o layout e estilo visual da sua loja.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={clsx(
                  "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                  selectedTheme === theme.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-100 hover:border-gray-300 bg-white"
                )}
              >
                <span className="text-2xl">{theme.emoji}</span>
                <div className="flex-1">
                  <p className={clsx("font-semibold text-sm", selectedTheme === theme.id ? "text-primary-700" : "text-gray-900")}>
                    {theme.label}
                  </p>
                  <p className="text-xs text-gray-400">{theme.desc}</p>
                </div>
                {selectedTheme === theme.id && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Botão salvar mobile */}
        <div className="sm:hidden pb-4">
          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-gradient-brand text-white shadow-lg disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> Salvar configurações
          </button>
        </div>
      </div>
    </form>
  );
}
