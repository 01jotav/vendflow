import { NextResponse } from "next/server";
import { db } from "@vendflow/database";
import { hashPassword, createSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Payload inválido" }, { status: 400 });

  const { slug, name, email, password, phone } = body as {
    slug?: string; name?: string; email?: string; password?: string; phone?: string;
  };

  if (!slug || !name || !email || !password || password.length < 6) {
    return NextResponse.json({ error: "Dados incompletos ou senha muito curta (mín. 6)" }, { status: 400 });
  }

  const store = await db.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });

  const existing = await db.customer.findUnique({
    where: { storeId_email: { storeId: store.id, email } },
    select: { id: true },
  });
  if (existing) return NextResponse.json({ error: "Email já cadastrado nesta loja" }, { status: 409 });

  const customer = await db.customer.create({
    data: {
      storeId: store.id,
      name,
      email,
      password: await hashPassword(password),
      phone: phone ?? null,
    },
    select: { id: true },
  });

  await createSession({ customerId: customer.id, storeId: store.id });
  return NextResponse.json({ ok: true });
}
