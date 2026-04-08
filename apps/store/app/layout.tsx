import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendflow",
  description: "Crie sua loja online em minutos com o Vendflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
