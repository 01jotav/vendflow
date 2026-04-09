"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm({ slug, themeColor }: { slug: string; themeColor: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/customer/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        phone: fd.get("phone") || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erro ao criar conta");
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
      <Field name="name" label="Nome completo" type="text" required />
      <Field name="email" label="Email" type="email" required />
      <Field name="phone" label="Telefone (opcional)" type="tel" />
      <Field name="password" label="Senha (mín. 6 caracteres)" type="password" required minLength={6} />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}

function Field({ name, label, type, required, minLength }: {
  name: string; label: string; type: string; required?: boolean; minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
    </div>
  );
}
