"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";

function titleFromPath(pathname: string) {
  if (pathname === "/admin") return "Painel Admin";
  if (pathname === "/admin/lojas") return "Lojas";
  if (pathname.startsWith("/admin/lojas/")) return "Detalhe da Loja";
  return "Admin";
}

export default function AdminHeaderWrapper({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  return <AdminHeader title={titleFromPath(pathname)} user={user} />;
}
