"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  storeSlug: string;
  themeColor: string;
  stock: number;
  isLoggedIn: boolean;
}

export default function AddToCartButton({
  productId, storeSlug, themeColor, stock, isLoggedIn,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = stock === 0;

  async function onClick() {
    setError(null);
    if (!isLoggedIn) {
      router.push(`/${storeSlug}/login?next=/${storeSlug}/produto/${productId}`);
      return;
    }
    const res = await fetch("/api/customer/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Erro ao adicionar");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex-1">
      <button
        onClick={onClick}
        disabled={disabled || pending}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
        {disabled ? "Esgotado" : added ? "Adicionado!" : "Adicionar ao carrinho"}
      </button>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
