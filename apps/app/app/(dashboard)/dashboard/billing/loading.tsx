export default function BillingLoading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      <div className="h-7 w-36 bg-gray-200 rounded-lg" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
        <div className="h-12 w-48 bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
}
