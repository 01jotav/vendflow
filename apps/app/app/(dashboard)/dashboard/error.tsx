"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Algo deu errado</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Não conseguimos carregar esta página. Pode ter sido um problema temporário de conexão.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all"
      >
        <RotateCw className="w-4 h-4" />
        Tentar novamente
      </button>
    </div>
  );
}
