"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  initialStatus: string;
}

/**
 * Polling de status: quando o pedido está PENDING, verifica a cada 5s
 * se o webhook do MP já atualizou para PAID. Ao mudar, faz refresh da página.
 */
export default function OrderStatusPoller({ orderId, initialStatus }: Props) {
  const router = useRouter();
  const [polling, setPolling] = useState(initialStatus === "PENDING");

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/customer/orders/${orderId}/status`);
        if (!res.ok) return;
        const { status } = await res.json();
        if (status !== "PENDING") {
          setPolling(false);
          router.refresh();
        }
      } catch {
        // silently ignore network errors, will retry
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, polling, router]);

  if (!polling) return null;

  return (
    <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
      <Loader2 className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
      <p className="text-sm text-amber-700">
        Aguardando confirmação do pagamento... A página será atualizada automaticamente.
      </p>
    </div>
  );
}
