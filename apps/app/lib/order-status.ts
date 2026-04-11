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

/**
 * State machine de pedidos.
 * Define quais transições são válidas a partir de cada status.
 *
 * Fluxo feliz: PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
 * Cancelamento: PENDING, PAID, PROCESSING podem cancelar
 * SHIPPED e DELIVERED não podem cancelar (precisa de fluxo de devolução)
 */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:    ["CANCELLED"],                          // webhook muda pra PAID, lojista só pode cancelar
  PAID:       ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["DELIVERED"],
  DELIVERED:  [],                                     // estado final
  CANCELLED:  [],                                     // estado final
};

/** Statuses que tinham estoque decrementado e precisam restaurar ao cancelar */
export const STATUSES_WITH_STOCK: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED"];
