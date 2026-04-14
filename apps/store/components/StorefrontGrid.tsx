import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  stock?: number;
  category?: { name: string } | null;
}

interface StorefrontGridProps {
  storeSlug: string;
  themeColor: string;
  isLoggedIn?: boolean;
  title?: string;
  subtitle?: string;
  products: Product[];
}

/**
 * Grid de produtos — design transplantado da Lovable.
 * Layout responsivo: 2 cols mobile / 2 tablet / 3 desktop / 4 large.
 */
export default function StorefrontGrid({
  storeSlug,
  themeColor,
  isLoggedIn,
  title = "Destaques",
  subtitle = "Produtos selecionados com os melhores preços.",
  products,
}: StorefrontGridProps) {
  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mb-8 sm:mb-10 text-gray-500 text-sm sm:text-base">{subtitle}</p>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              storeSlug={storeSlug}
              themeColor={themeColor}
              isLoggedIn={isLoggedIn}
              product={product}
              showCategory
              showSoldOut
            />
          ))}
        </div>
      </div>
    </section>
  );
}
