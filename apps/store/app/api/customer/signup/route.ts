import { NextResponse } from "next/server";
import { db, checkRateLimit, recordAttempt } from "@vendflow/database";
import { hashPassword, createSession } from "@/lib/customer-auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit: 3 cadastros por IP em 15 min
  const rl = await checkRateLimit({ prefix: "customer-signup", key: ip, maxAttempts: 3, windowSeconds: 900 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

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

  await recordAttempt("customer-signup", ip);

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
