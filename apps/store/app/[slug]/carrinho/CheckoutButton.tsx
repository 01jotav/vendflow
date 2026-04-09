"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  themeColor: string;
  disabled?: boolean;
}

export default function CheckoutButton({ themeColor, disabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/customer/checkout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.checkoutUrl) {
      setError(data.error ?? "Erro ao iniciar pagamento");
      setLoading(false);
      return;
    }
    window.location.href = data.checkoutUrl;
  }

  return (
    <>
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? "Redirecionando..." : "Finalizar compra"}
      </button>
      {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
    </>
  );
}
