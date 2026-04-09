"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatBRL } from "@/lib/store-chrome";

interface CartItemRowProps {
  item: {
    id: string;
    quantity: number;
    product: { id: string; name: string; price: number; images: string[] };
  };
  themeColor: string;
}

export default function CartItemRow({ item, themeColor }: CartItemRowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [qty, setQty] = useState(item.quantity);

  async function updateQty(next: number) {
    setQty(next);
    await fetch("/api/customer/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, quantity: next }),
    });
    startTransition(() => router.refresh());
  }

  async function remove() {
    await fetch(`/api/customer/cart?itemId=${item.id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0">
        {item.product.images[0] && (
          <Image src={item.product.images[0]} alt={item.product.name} fill sizes="96px" className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product.name}</p>
          <p className="text-sm font-extrabold mt-1" style={{ color: themeColor }}>
            {formatBRL(item.product.price)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(Math.max(1, qty - 1))}
              disabled={pending || qty <= 1}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-semibold w-6 text-center">{qty}</span>
            <button
              onClick={() => updateQty(qty + 1)}
              disabled={pending}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={remove}
            disabled={pending}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
            aria-label="Remover"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
