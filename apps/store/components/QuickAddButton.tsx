"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useCartCount } from "@/components/CartCountProvider";

interface QuickAddButtonProps {
  productId: string;
  storeSlug: string;
  stock: number;
  isLoggedIn: boolean;
  /** visible = card is hovered (desktop). On mobile it's always visible. */
  visible?: boolean;
}

/**
 * Small circular cart button that appears on hover inside ProductCard.
 * Must call preventDefault + stopPropagation to avoid triggering the parent Link.
 */
export default function QuickAddButton({
  productId,
  storeSlug,
  stock,
  isLoggedIn,
  visible = true,
}: QuickAddButtonProps) {
  const router = useRouter();
  const { increment } = useCartCount();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const outOfStock = stock === 0;

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock || state !== "idle") return;

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
      if (!res.ok) {
        setState("idle");
        return;
      }
      increment(1);
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={outOfStock || state !== "idle"}
      aria-label="Adicionar ao carrinho"
      className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 sm:opacity-0"}
        sm:group-hover:opacity-100 sm:group-hover:translate-y-0`}
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "done" ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </button>
  );
}
