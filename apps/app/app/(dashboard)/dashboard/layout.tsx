import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { headers } from "next/headers";

const pageTitles: Record<string, string> = {
  "/dashboard":           "Visão geral",
  "/dashboard/loja":      "Minha loja",
  "/dashboard/produtos":  "Produtos",
  "/dashboard/pedidos":     "Pedidos",
  "/dashboard/integracoes": "Integrações",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/dashboard";
  const title = pageTitles[pathname] ?? "Painel";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPath={pathname} storeSlug={session.user.store?.slug ?? null} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={title}
          currentPath={pathname}
          user={{
            name:  session.user.name  ?? "Lojista",
            email: session.user.email ?? "",
            store: session.user.store ?? null,
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
