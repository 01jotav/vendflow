export default function ProdutoLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Image skeleton */}
        <div className="aspect-square w-full bg-gray-200 rounded-2xl animate-pulse mb-6" />

        {/* Title + price */}
        <div className="space-y-3 mb-6">
          <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-7 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-8">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-14 w-full bg-gray-300 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
