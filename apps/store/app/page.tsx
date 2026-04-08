export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Vendflow Store</h1>
        <p className="text-sm text-gray-500">
          Esta é a base de hospedagem das lojas Vendflow. Para acessar uma loja, use o link
          fornecido pelo lojista (ex: <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">/minha-loja</code>).
        </p>
      </div>
    </main>
  );
}
