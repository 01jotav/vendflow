"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name:        z.string().min(2, "Nome obrigatório"),
  description: z.string().optional(),
  themeColor:  z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#7c3aed"),
  theme:       z.enum(["MODERN", "YOUNG", "ELEGANT", "MINIMAL"]).default("MODERN"),
  logoUrl:     z.string().url().or(z.literal("")).optional(),
});

export type StoreState = { message?: string; success?: boolean };

export async function updateStoreAction(
  _prev: StoreState,
  formData: FormData,
): Promise<StoreState> {
  const session = await auth();
  if (!session?.user?.store?.id) return { message: "Não autorizado" };

  const parsed = schema.safeParse({
    name:        formData.get("name"),
    description: formData.get("description") || undefined,
    themeColor:  formData.get("themeColor"),
    theme:       formData.get("theme"),
    logoUrl:     formData.get("logoUrl") || "",
  });

  if (!parsed.success) return { message: "Dados inválidos" };

  const { logoUrl, ...rest } = parsed.data;
  await db.store.update({
    where: { id: session.user.store.id },
    data: { ...rest, logoUrl: logoUrl || null },
  });

  revalidatePath("/dashboard/loja");
  return { success: true };
}

// ─── Webhook URL ────────────────────────────────────────────────────────────

const webhookSchema = z.object({
  webhookUrl: z.string().url("URL inválida").or(z.literal("")),
});

export async function updateWebhookAction(
  _prev: StoreState | null,
  formData: FormData,
): Promise<StoreState> {
  const session = await auth();
  if (!session?.user?.store?.id) return { message: "Não autorizado" };

  const raw = (formData.get("webhookUrl") as string)?.trim() ?? "";
  const parsed = webhookSchema.safeParse({ webhookUrl: raw });
  if (!parsed.success) return { message: "URL inválida. Use https://..." };

  await db.store.update({
    where: { id: session.user.store.id },
    data: { webhookUrl: parsed.data.webhookUrl || null },
  });

  revalidatePath("/dashboard/integracoes");
  return { success: true, message: raw ? "Webhook salvo com sucesso!" : "Webhook removido." };
}

// ─── Teste de Webhook ───────────────────────────────────────────────────────

export async function testWebhookAction(): Promise<StoreState> {
  const session = await auth();
  if (!session?.user?.store?.id) return { message: "Não autorizado" };

  const store = await db.store.findUnique({
    where: { id: session.user.store.id },
    select: { webhookUrl: true, plan: true },
  });

  if (store?.plan !== "PRO") return { message: "Disponível apenas no plano PRO." };
  if (!store.webhookUrl) return { message: "Salve uma URL de webhook antes de testar." };

  const payload = {
    event: "order.paid",
    timestamp: new Date().toISOString(),
    data: {
      orderId: "test_ord_" + Math.random().toString(36).slice(2, 10),
      status: "PAID",
      total: 259.80,
      customer: {
        name: "João Teste",
        phone: "+55 11 99999-0000",
        email: "joao.teste@email.com",
      },
      items: [
        { product: "Sérum Vitamina C 30ml", quantity: 2, price: 89.90 },
        { product: "Protetor Solar FPS 50", quantity: 1, price: 80.00 },
      ],
    },
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(store.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Vendflow/1.0 (test)",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      return { success: true, message: `Teste enviado com sucesso! Resposta: ${res.status}` };
    }
    return { message: `Webhook respondeu com erro: ${res.status} ${res.statusText}` };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { message: "Timeout: o webhook não respondeu em 10 segundos." };
    }
    return { message: `Erro ao conectar: ${err.message}` };
  }
}
