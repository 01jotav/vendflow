import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@vendflow/database";

/**
 * Valida um access token fazendo uma chamada à API do MP.
 * Retorna { userId, liveMode } se válido, null se inválido.
 */
async function validateMpToken(accessToken: string): Promise<{ userId: string; liveMode: boolean } | null> {
  try {
    const res = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const userId = data?.id ? String(data.id) : null;
    if (!userId) return null;
    // Tokens de produção começam com APP_USR, tokens de teste com TEST
    const liveMode = accessToken.startsWith("APP_USR-") && !data?.site_id?.includes("TEST");
    return { userId, liveMode };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.store?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const storeId = session.user.store.id;

  const body = await req.json().catch(() => null);
  const { accessToken, publicKey } = (body ?? {}) as { accessToken?: string; publicKey?: string };
  if (!accessToken || !publicKey) {
    return NextResponse.json({ error: "Access Token e Public Key são obrigatórios" }, { status: 400 });
  }

  const validation = await validateMpToken(accessToken);
  if (!validation) {
    return NextResponse.json({ error: "Access Token inválido — verifique no painel do Mercado Pago" }, { status: 400 });
  }

  await db.mercadoPagoConfig.upsert({
    where: { storeId },
    create: {
      storeId,
      accessToken,
      publicKey,
      mpUserId: validation.userId,
      liveMode: validation.liveMode,
    },
    update: {
      accessToken,
      publicKey,
      mpUserId: validation.userId,
      liveMode: validation.liveMode,
    },
  });

  return NextResponse.json({ ok: true, liveMode: validation.liveMode });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.store?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  await db.mercadoPagoConfig.delete({ where: { storeId: session.user.store.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
