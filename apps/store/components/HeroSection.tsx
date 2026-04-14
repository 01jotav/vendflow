import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  storeName: string;
  description?: string | null;
  themeColor: string;
  /** âncora-alvo para o CTA — scroll até o grid */
  ctaHref?: string;
}

/**
 * Hero premium na linguagem visual da Lovable: fundo gradiente sutil,
 * tipografia tight e tracking-tight, CTA com seta.
 */
export default function HeroSection({
  storeName,
  description,
  themeColor,
  ctaHref = "#produtos",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${themeColor}14 0%, ${themeColor}06 55%, transparent 100%)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-6 shadow-sm"
            style={{ backgroundColor: themeColor }}
          >
            Nova coleção
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05] mb-5">
            {storeName}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-gray-500 max-w-lg mb-8 leading-relaxed">
              {description}
            </p>
          )}
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Ver coleção
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
