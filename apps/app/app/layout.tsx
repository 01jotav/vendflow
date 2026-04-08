import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendflow — Painel",
  description: "Gerencie sua loja de cosméticos no Vendflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
