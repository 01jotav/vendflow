"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import { useCartCount } from "@/components/CartCountProvider";

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
  const { increment } = useCartCount();
  const [, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticAdding, setOptimisticAdding] = useOptimistic(false);

  const disabled = stock === 0;

  async function onClick() {
    setError(null);
    if (!isLoggedIn) {
      router.push(`/${storeSlug}/login?next=/${storeSlug}/produto/${productId}`);
      return;
    }

    // Optimistic: show "Adicionado!" and update header badge immediately
    startTransition(() => setOptimisticAdding(true));
    setAdded(true);
    increment(1);

    try {
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAdded(false);
        setError(data.error ?? "Erro ao adicionar");
        return;
      }

      // Refresh to update cart count in header
      setTimeout(() => {
        setAdded(false);
        startTransition(() => router.refresh());
      }, 1200);
    } catch {
      setAdded(false);
      setError("Erro de conexão");
    }
  }

  const showAdded = added || optimisticAdding;

  return (
    <div className="flex-1">
      <button
        onClick={onClick}
        disabled={disabled || showAdded}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {showAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
        {disabled ? "Esgotado" : showAdded ? "Adicionado!" : "Adicionar ao carrinho"}
      </button>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
