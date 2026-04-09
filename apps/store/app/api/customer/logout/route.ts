import { NextResponse } from "next/server";
import { destroySession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  await destroySession();
  // Redireciona pra home da loja baseado no referer (se disponível)
  const referer = req.headers.get("referer");
  const url = referer ? new URL(referer) : null;
  const slug = url?.pathname.split("/")[1];
  return NextResponse.redirect(new URL(slug ? `/${slug}` : "/", req.url), { status: 303 });
}
