import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendflow — Sua loja de cosméticos online em minutos",
  description:
    "Crie, personalize e venda. O Vendflow é a plataforma completa para lojistas de cosméticos que querem crescer online com estilo e automação.",
  keywords: ["ecommerce", "cosméticos", "loja virtual", "saas", "vendas online"],
  openGraph: {
    title: "Vendflow — Sua loja de cosméticos online em minutos",
    description:
      "Crie sua loja personalizada, configure pagamentos e comece a vender em minutos.",
    url: "https://vendflow.com.br",
    siteName: "Vendflow",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendflow — Sua loja de cosméticos online",
    description: "Plataforma completa para lojistas de cosméticos.",
  },
  metadataBase: new URL("https://vendflow.com.br"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
