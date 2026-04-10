import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeaderWrapper from "./components/AdminHeaderWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeaderWrapper user={{ name: session.user.name ?? "Admin", email: session.user.email ?? "" }} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
