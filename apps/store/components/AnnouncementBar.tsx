import { Sparkles } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  themeColor: string;
}

/**
 * Barra fina no topo do storefront. Estilo premium neutro na linguagem
 * visual da Lovable — fundo escuro, texto centralizado, pequeno ícone.
 */
export default function AnnouncementBar({
  text = "Frete combinado via WhatsApp • Troca em até 7 dias • Compra 100% segura",
  themeColor,
}: AnnouncementBarProps) {
  return (
    <div
      className="w-full text-white text-xs sm:text-sm font-medium"
      style={{ backgroundColor: themeColor }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{text}</span>
      </div>
    </div>
  );
}
