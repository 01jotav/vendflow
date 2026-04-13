export default function PedidoLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Status badge skeleton */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Order details skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4 mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Total skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex justify-between">
            <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
