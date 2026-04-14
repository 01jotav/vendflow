export default function PedidosLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 w-40 bg-gray-200 rounded-lg" />
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
