"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";

export default function CarrinhoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <ShoppingBag className="w-7 h-7 text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Erro ao carregar o carrinho
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-5">
        Houve um problema temporário. Tente novamente.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
