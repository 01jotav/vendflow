"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@vendflow/database";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

const registerSchema = z.object({
  name:      z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email:     z.string().email("E-mail inválido"),
  storeName: z.string().min(2, "Nome da loja deve ter no mínimo 2 caracteres"),
  password:  z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

// ─── Login ──────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email:    parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-mail ou senha incorretos." };
        default:
          return { error: "Erro ao fazer login. Tente novamente." };
      }
    }
    throw error;
  }

  redirect("/dashboard");
}

// ─── Cadastro ────────────────────────────────────────────────────────────────

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name:      formData.get("name"),
    email:     formData.get("email"),
    storeName: formData.get("storeName"),
    password:  formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, storeName, password } = parsed.data;

  // Checar se e-mail já existe
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Este e-mail já está cadastrado." };
  }

  // Gerar slug da loja a partir do nome
  const slug = storeName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Checar se slug já existe e torná-lo único
  const slugExists = await db.store.findUnique({ where: { slug } });
  const finalSlug  = slugExists ? `${slug}-${Date.now()}` : slug;

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 12);

  // Criar user + store em transação
  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await tx.store.create({
      data: {
        name:       storeName,
        slug:       finalSlug,
        ownerId:    user.id,
        themeColor: "#7c3aed",
        theme:      "MODERN",
      },
    });
  });

  // Login automático após cadastro
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // Se o login automático falhar, redireciona para login manual
    redirect("/login");
  }

  redirect("/dashboard");
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
