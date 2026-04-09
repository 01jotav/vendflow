"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ slug, themeColor }: { slug: string; themeColor: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erro ao entrar");
      return;
    }
    router.push(`/${slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
