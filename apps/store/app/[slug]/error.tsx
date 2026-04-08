"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Não foi possível carregar a loja</h2>
      <p className="text-sm text-gray-500 max-w-md mb-5">
        Pode ter sido um problema temporário. Tente recarregar.
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
