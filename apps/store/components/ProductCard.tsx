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
      className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
    >
      <div className="h-36 sm:h-44 bg-gray-100 relative">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : null}
        {showSoldOut && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full border">
              Esgotado
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        {showCategory && product.category && (
          <p className="text-xs text-gray-400 mb-0.5">{product.category.name}</p>
        )}
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5">{product.name}</p>
        <p className="text-base font-extrabold" style={{ color: themeColor }}>
          {formatBRL(product.price)}
        </p>
      </div>
    </a>
  );
}
