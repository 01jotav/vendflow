import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isAuthRoute      = pathname.startsWith("/login") || pathname.startsWith("/cadastro");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Rota protegida sem sessão → redireciona para login
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Já logado tentando acessar login/cadastro → redireciona para dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/cadastro"],
};
