import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/admin";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar currentPath={pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title={
            pathname === "/admin" ? "Painel Admin" :
            pathname === "/admin/lojas" ? "Lojas" :
            pathname.startsWith("/admin/lojas/") ? "Detalhe da Loja" :
            "Admin"
          }
          user={{ name: session.user.name ?? "Admin", email: session.user.email ?? "" }}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
