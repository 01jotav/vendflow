import type { OrderStatus } from "@prisma/client";

export const PAID_ORDER_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: "Pendente",    color: "bg-yellow-100 text-yellow-700" },
  PAID:       { label: "Pago",        color: "bg-green-100 text-green-700" },
  PROCESSING: { label: "Processando", color: "bg-blue-100 text-blue-700" },
  SHIPPED:    { label: "Enviado",     color: "bg-purple-100 text-purple-700" },
  DELIVERED:  { label: "Entregue",    color: "bg-emerald-100 text-emerald-700" },
  CANCELLED:  { label: "Cancelado",   color: "bg-red-100 text-red-600" },
};
