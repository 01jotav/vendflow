"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Check } from "lucide-react";
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
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const outOfStock = stock === 0;

  async function onClick() {
    setError(null);
    if (!isLoggedIn) {
      router.push(`/${storeSlug}/login?next=/${storeSlug}/produto/${productId}`);
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("idle");
        setError(data.error ?? "Erro ao adicionar");
        return;
      }

      // Servidor confirmou — agora atualiza badge e mostra feedback
      increment(1);
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
      setError("Erro de conexão");
    }
  }

  return (
    <div className="flex-1">
      <button
        onClick={onClick}
        disabled={outOfStock || state !== "idle"}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        style={{ backgroundColor: themeColor }}
      >
        {state === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
        {state === "done" && <Check className="w-5 h-5" />}
        {state === "idle" && <ShoppingBag className="w-5 h-5" />}
        {outOfStock ? "Esgotado" : state === "loading" ? "Adicionando..." : state === "done" ? "Adicionado!" : "Adicionar ao carrinho"}
      </button>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
