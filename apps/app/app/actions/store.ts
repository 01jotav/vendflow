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
  });

  if (!parsed.success) return { message: "Dados inválidos" };

  await db.store.update({
    where: { id: session.user.store.id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/loja");
  return { success: true };
}
