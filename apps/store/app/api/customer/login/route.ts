import { NextResponse } from "next/server";
import { db } from "@vendflow/database";
import { verifyPassword, createSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Payload inválido" }, { status: 400 });

  const { slug, email, password } = body as { slug?: string; email?: string; password?: string };
  if (!slug || !email || !password) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const store = await db.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });

  const customer = await db.customer.findUnique({
    where: { storeId_email: { storeId: store.id, email } },
    select: { id: true, password: true },
  });
  if (!customer || !(await verifyPassword(password, customer.password))) {
    return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
  }

  await createSession({ customerId: customer.id, storeId: store.id });
  return NextResponse.json({ ok: true });
}
