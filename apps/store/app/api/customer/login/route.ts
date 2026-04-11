import { NextResponse } from "next/server";
import { db, checkRateLimit, recordAttempt } from "@vendflow/database";
import { verifyPassword, createSession } from "@/lib/customer-auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit: 5 tentativas por IP em 15 min
  const rl = await checkRateLimit({ prefix: "customer-login", key: ip, maxAttempts: 5, windowSeconds: 900 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

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
    await recordAttempt("customer-login", ip);
    return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
  }

  await createSession({ customerId: customer.id, storeId: store.id });
  return NextResponse.json({ ok: true });
}
