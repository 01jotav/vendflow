import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@vendflow/database";

const COOKIE_NAME = "vf_customer_session";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret = process.env.CUSTOMER_JWT_SECRET;
  if (!secret) throw new Error("CUSTOMER_JWT_SECRET não configurado");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

type SessionPayload = {
  customerId: string;
  storeId: string;
};

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.customerId !== "string" || typeof payload.storeId !== "string") return null;
    return { customerId: payload.customerId, storeId: payload.storeId };
  } catch {
    return null;
  }
}

/**
 * Retorna o customer logado se a sessão for válida E pertencer à loja indicada.
 * Clientes são scoped por loja, então uma sessão de loja A não vale em loja B.
 */
export async function getCurrentCustomer(storeId: string) {
  const session = await readSession();
  if (!session || session.storeId !== storeId) return null;
  return db.customer.findUnique({
    where: { id: session.customerId },
    select: { id: true, name: true, email: true, phone: true, address: true, storeId: true },
  });
}
