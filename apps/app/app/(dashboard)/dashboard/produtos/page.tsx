import { Plus, Package } from "lucide-react";
import clsx from "clsx";
import { auth } from "@/auth";
import { db } from "@vendflow/database";
import ProductActions from "./ProductActions";

export default async function ProdutosPage() {
  const session = await auth();
  const storeId = session?.user?.store?.id;

  const products = storeId
    ? await db.product.findMany({
        where: { storeId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} produtos cadastrados</p>
        </div>
        <a
          href="/dashboard/produtos/novo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </a>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Nenhum produto ainda</h3>
          <p className="text-sm text-gray-400 mb-5">Adicione seu primeiro produto para começar a vender.</p>
          <a
            href="/dashboard/produtos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Adicionar produto
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produto</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Estoque</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {product.category ? (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right hidden md:table-cell">
                      <span className={clsx("text-sm font-medium", product.stock === 0 ? "text-red-500" : "text-gray-600")}>
                        {product.stock === 0 ? "Esgotado" : product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={clsx(
                        "text-xs px-2.5 py-1 rounded-full font-semibold",
                        product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ProductActions id={product.id} active={product.active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
