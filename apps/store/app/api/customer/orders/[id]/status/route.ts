import { NextResponse } from "next/server";
import { db } from "@vendflow/database";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const token = (await cookies()).get("vf_customer_session")?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(process.env.CUSTOMER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.customerId !== "string") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const order = await db.order.findUnique({
      where: { id },
      select: { status: true, customerId: true },
    });

    if (!order || order.customerId !== payload.customerId) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
