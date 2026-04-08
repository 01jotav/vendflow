export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-violet-500 animate-spin" />
        <p className="text-sm text-gray-400">Carregando loja...</p>
      </div>
    </div>
  );
}
