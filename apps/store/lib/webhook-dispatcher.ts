import { db } from "@vendflow/database";

interface OrderEventData {
  orderId: string;
  status: string;
  total: number;
  customer: { name: string; phone: string | null; email: string };
  items: { product: string; quantity: number; price: number }[];
}

/**
 * Dispara um evento de pedido para a webhookUrl da loja.
 * Fire-and-forget: não lança exceção, apenas loga erros.
 */
export async function dispatchOrderEvent(
  storeId: string,
  event: string,
  data: OrderEventData,
): Promise<void> {
  try {
    const store = await db.store.findUnique({
      where: { id: storeId },
      select: { webhookUrl: true, plan: true },
    });

    if (!store?.webhookUrl || store.plan !== "PRO") return;

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

    await fetch(store.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Vendflow/1.0" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (err) {
    // Fire-and-forget: log mas não propaga
    console.error(`[webhook-dispatcher] Erro ao disparar ${event} para store ${storeId}:`, err);
  }
}
