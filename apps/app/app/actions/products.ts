"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const schema = z.object({
  name:        z.string().min(2, "Nome obrigatório"),
  description: z.string().optional(),
  price:       z.coerce.number().min(0.01, "Preço inválido"),
  stock:       z.coerce.number().int().min(0).default(0),
  category:    z.string().optional(),
  active:      z.string().transform((v) => v === "true"),
});

export type ProductState = {
  errors?: Partial<Record<"name" | "price" | "stock", string[]>>;
  message?: string;
};

export async function createProductAction(
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const session = await auth();
  if (!session?.user?.store?.id) return { message: "Não autorizado" };

  const images = formData.getAll("images").map(String).filter(Boolean);

  const parsed = schema.safeParse({
    name:        formData.get("name"),
    description: formData.get("description") || undefined,
    price:       formData.get("price"),
    stock:       formData.get("stock") || "0",
    category:    formData.get("category") || undefined,
    active:      formData.get("active") ?? "true",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as ProductState["errors"] };
  }

  const { name, description, price, stock, category, active } = parsed.data;

  let categoryId: string | undefined;
  if (category) {
    const existing = await db.category.findFirst({ where: { name: category } });
    const cat = existing ?? (await db.category.create({ data: { name: category } }));
    categoryId = cat.id;
  }

  await db.product.create({
    data: {
      name,
      description,
      price,
      stock,
      active,
      images,
      storeId: session.user.store.id,
      ...(categoryId ? { categoryId } : {}),
    },
  });

  revalidatePath("/dashboard/produtos");
  redirect("/dashboard/produtos");
}

const editSchema = z.object({
  name:        z.string().min(2, "Nome obrigatório"),
  description: z.string().optional(),
  price:       z.coerce.number().min(0.01, "Preço inválido"),
  stock:       z.coerce.number().int().min(0).default(0),
  category:    z.string().optional(),
  active:      z.string().transform((v) => v === "true"),
});

export async function editProductAction(
  id: string,
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const session = await auth();
  if (!session?.user?.store?.id) return { message: "Não autorizado" };

  const images = formData.getAll("images").map(String).filter(Boolean);

  const parsed = editSchema.safeParse({
    name:        formData.get("name"),
    description: formData.get("description") || undefined,
    price:       formData.get("price"),
    stock:       formData.get("stock") || "0",
    category:    formData.get("category") || undefined,
    active:      formData.get("active") ?? "true",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as ProductState["errors"] };
  }

  const { name, description, price, stock, category, active } = parsed.data;

  let categoryId: string | undefined | null = null;
  if (category) {
    const existing = await db.category.findFirst({ where: { name: category } });
    const cat = existing ?? (await db.category.create({ data: { name: category } }));
    categoryId = cat.id;
  }

  await db.product.updateMany({
    where: { id, storeId: session.user.store.id },
    data: {
      name,
      description,
      price,
      stock,
      active,
      images,
      ...(categoryId !== null ? { categoryId } : { categoryId: null }),
    },
  });

  revalidatePath("/dashboard/produtos");
  redirect("/dashboard/produtos");
}

export async function toggleProductAction(id: string, active: boolean) {
  const session = await auth();
  if (!session?.user?.store?.id) return;

  await db.product.updateMany({
    where: { id, storeId: session.user.store.id },
    data: { active },
  });

  revalidatePath("/dashboard/produtos");
}

export async function deleteProductAction(id: string) {
  const session = await auth();
  if (!session?.user?.store?.id) return;

  await db.product.deleteMany({
    where: { id, storeId: session.user.store.id },
  });

  revalidatePath("/dashboard/produtos");
}
