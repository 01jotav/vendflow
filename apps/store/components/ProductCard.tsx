import Image from "next/image";
import { formatBRL } from "@/lib/store-chrome";

interface ProductCardProps {
  storeSlug: string;
  themeColor: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock?: number;
    category?: { name: string } | null;
  };
  sizes?: string;
  showCategory?: boolean;
  showSoldOut?: boolean;
}

export default function ProductCard({
  storeSlug,
  themeColor,
  product,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  showCategory = false,
  showSoldOut = false,
}: ProductCardProps) {
  return (
    <a
      href={`/${storeSlug}/produto/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100/80 hover:border-gray-200 transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-lg">📷</span>
            </div>
          </div>
        )}
        {showSoldOut && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
              Esgotado
            </span>
          </div>
        )}
      </div>
      <div className="p-3.5">
        {showCategory && product.category && (
          <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: themeColor }}>
            {product.category.name}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">{product.name}</p>
        <p className="text-base font-extrabold" style={{ color: themeColor }}>
          {formatBRL(product.price)}
        </p>
      </div>
    </a>
  );
}
