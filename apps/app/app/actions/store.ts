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
