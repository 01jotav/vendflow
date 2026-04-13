"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CartCountCtx {
  count: number | null; // null = no provider, use prop fallback
  increment: (n?: number) => void;
}

const CartCountContext = createContext<CartCountCtx>({
  count: null,
  increment: () => {},
});

export function CartCountProvider({ initial, children }: { initial: number; children: ReactNode }) {
  const [count, setCount] = useState(initial);
  const increment = useCallback((n = 1) => setCount((c) => c + n), []);
  return (
    <CartCountContext.Provider value={{ count, increment }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  return useContext(CartCountContext);
}
