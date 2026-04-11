"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pendente",    color: "bg-yellow-100 text-yellow-700" },
  PAID:       { label: "Pago",        color: "bg-green-100 text-green-700" },
  PROCESSING: { label: "Processando", color: "bg-purple-100 text-purple-700" },
  SHIPPED:    { label: "Enviado",     color: "bg-blue-100 text-blue-700" },
  DELIVERED:  { label: "Entregue",    color: "bg-gray-100 text-gray-600" },
  CANCELLED:  { label: "Cancelado",   color: "bg-red-100 text-red-600" },
};

/** Transições válidas — espelha VALID_TRANSITIONS de order-status.ts */
const TRANSITIONS: Record<string, string[]> = {
  PENDING:    ["CANCELLED"],
  PAID:       ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["DELIVERED"],
  DELIVERED:  [],
  CANCELLED:  [],
};

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const current = STATUS_META[status] ?? STATUS_META.PENDING;
  const nextStates = TRANSITIONS[status] ?? [];

  // Estado final ou sem transições — mostra badge readonly
  if (nextStates.length === 0) {
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
        setStatus(currentStatus);
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
      <option value={status}>{current.label}</option>
      {nextStates.map((s) => (
        <option key={s} value={s}>
          {STATUS_META[s]?.label ?? s}
        </option>
      ))}
    </select>
  );
}
