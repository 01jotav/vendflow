export default function LojaLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="h-7 w-32 bg-gray-200 rounded-lg" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
        <div className="h-10 w-32 bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
}
