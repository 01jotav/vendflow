export default function CarrinhoLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />

        {/* Cart items skeleton */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full bg-gray-300 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
