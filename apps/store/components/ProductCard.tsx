import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/store-chrome";
import QuickAddButton from "@/components/QuickAddButton";

interface ProductCardProps {
  storeSlug: string;
  themeColor: string;
  isLoggedIn?: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
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
  isLoggedIn = false,
  product,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  showCategory = false,
  showSoldOut = false,
}: ProductCardProps) {
  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;
  const outOfStock = showSoldOut && product.stock === 0;

  return (
    <Link
      href={`/${storeSlug}/produto/${product.id}`}
      className="group relative block rounded-2xl bg-white transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-square bg-gray-50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-lg">📷</span>
            </div>
          </div>
        )}

        {hasDiscount && !outOfStock && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            -{discountPercent}%
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
              Esgotado
            </span>
          </div>
        )}

        {!outOfStock && (
          <QuickAddButton
            productId={product.id}
            storeSlug={storeSlug}
            stock={product.stock ?? 1}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      <div className="p-3.5">
        {showCategory && product.category && (
          <p
            className="text-[11px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: themeColor }}
          >
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5 tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatBRL(product.compareAtPrice!)}
            </span>
          )}
          <span className="text-base font-bold" style={{ color: themeColor }}>
            {formatBRL(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
