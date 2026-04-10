export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded" />

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-100 rounded" />
            <div className="h-3 w-40 bg-gray-100 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-100 rounded-xl" />
            <div className="h-10 w-24 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-6 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-4 w-full bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
