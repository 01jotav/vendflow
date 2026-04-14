import type { OrderStatus } from "@prisma/client";

export const PAID_ORDER_STATUSES: OrderStatus[] = ["PAID", "MANUAL_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED"];

export const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:        { label: "Pendente",       color: "bg-yellow-100 text-yellow-700" },
  PAID:           { label: "Pago",           color: "bg-green-100 text-green-700" },
  MANUAL_PAYMENT: { label: "Pago por fora",  color: "bg-teal-100 text-teal-700" },
  PROCESSING:     { label: "Processando",    color: "bg-blue-100 text-blue-700" },
  SHIPPED:        { label: "Enviado",        color: "bg-purple-100 text-purple-700" },
  DELIVERED:      { label: "Entregue",       color: "bg-emerald-100 text-emerald-700" },
  CANCELLED:      { label: "Cancelado",      color: "bg-red-100 text-red-600" },
};

/**
 * State machine de pedidos (transições manuais do lojista).
 * PAID nunca aparece aqui — é exclusivo do webhook de pagamento.
 *
 * Fluxo feliz: PENDING → (PAID via webhook | MANUAL_PAYMENT) → PROCESSING → SHIPPED → DELIVERED
 * Cancelamento: PENDING, PAID, MANUAL_PAYMENT, PROCESSING podem cancelar
 */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:        ["MANUAL_PAYMENT", "CANCELLED"],
  PAID:           ["PROCESSING", "CANCELLED"],
  MANUAL_PAYMENT: ["PROCESSING", "CANCELLED"],
  PROCESSING:     ["SHIPPED", "CANCELLED"],
  SHIPPED:        ["DELIVERED"],
  DELIVERED:      [],
  CANCELLED:      [],
};

/** Statuses que tinham estoque decrementado e precisam restaurar ao cancelar */
export const STATUSES_WITH_STOCK: OrderStatus[] = ["PAID", "MANUAL_PAYMENT", "PROCESSING", "SHIPPED"];
