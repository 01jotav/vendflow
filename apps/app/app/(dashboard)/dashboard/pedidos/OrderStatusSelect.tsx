"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const OPTIONS: { value: string; label: string; color: string }[] = [
  { value: "PENDING",    label: "Pendente",   color: "bg-yellow-100 text-yellow-700" },
  { value: "PAID",       label: "Pago",       color: "bg-green-100 text-green-700" },
  { value: "PROCESSING", label: "Processando", color: "bg-purple-100 text-purple-700" },
  { value: "SHIPPED",    label: "Enviado",    color: "bg-blue-100 text-blue-700" },
  { value: "DELIVERED",  label: "Entregue",   color: "bg-gray-100 text-gray-600" },
  { value: "CANCELLED",  label: "Cancelado",  color: "bg-red-100 text-red-600" },
];

// PENDING é atualizado pelo webhook do MP — lojista não edita.
const READONLY = new Set(["PENDING"]);

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const current = OPTIONS.find((o) => o.value === status) ?? OPTIONS[0];

  // Status que o lojista pode *atribuir*.
  const assignable = OPTIONS.filter((o) => !READONLY.has(o.value));

  if (READONLY.has(status)) {
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${current.color}`}>
        {current.label}
      </span>
    );
  }

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    if (next === status) return;
    setStatus(next);
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setStatus(currentStatus); // rollback
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Erro ao atualizar status");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <select
      value={status}
      onChange={onChange}
      disabled={pending}
      className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 ${current.color} disabled:opacity-60`}
    >
      {assignable.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
