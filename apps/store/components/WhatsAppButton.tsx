"use client";

import { MessageCircle } from "lucide-react";

interface OrderItem {
  quantity: number;
  price: number;
  product: { name: string };
}

interface Props {
  whatsappNumber: string;
  storeName: string;
  orderCode: string;
  total: number;
  customerName: string;
  customerPhone: string | null;
  address: { rua?: string; numero?: string; bairro?: string; cep?: string } | null;
  items: OrderItem[];
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function WhatsAppButton({
  whatsappNumber,
  storeName,
  orderCode,
  total,
  customerName,
  customerPhone,
  address,
  items,
}: Props) {
  const itemsList = items
    .map((item) => `${item.quantity}x ${item.product.name} (${formatBRL(item.price * item.quantity)})`)
    .join("\n");

  const phone = customerPhone ? ` (${customerPhone})` : "";

  const addressLine = address?.rua
    ? `\u{1F4CD} *Endere\u{00E7}o:* ${address.rua}${address.numero ? `, ${address.numero}` : ""}${address.bairro ? `, ${address.bairro}` : ""}${address.cep ? ` - ${address.cep}` : ""}`
    : "";

  const parts = [
    `\u{1F6CD}\uFE0F *Novo Pedido: #${orderCode}*`,
    `\u{1F3EA} *Loja:* ${storeName}`,
    "",
    `\u{1F4E6} *Itens do Pedido:*`,
    "",
    itemsList,
    "",
    `\u{1F4B0} *Total do Pedido:* ${formatBRL(total)}`,
    "",
    `\u{1F464} *Cliente:* ${customerName}${phone}`,
    addressLine,
    "",
    `\u{1F69A} Ol\u{00E1}! Gostaria de combinar o frete e a entrega deste pedido.`,
  ].filter(Boolean).join("\n");

  const href = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(parts)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 mt-4 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe57] transition-colors shadow-lg shadow-[#25D366]/30"
    >
      <MessageCircle className="w-5 h-5" />
      Finalizar entrega via WhatsApp
    </a>
  );
}
