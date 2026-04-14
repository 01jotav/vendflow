"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { editProductAction } from "@/app/actions/products";
import ImageUpload from "@/components/ui/ImageUpload";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  active: boolean;
  images: string[];
  category: { name: string } | null;
}

export default function EditProdutoForm({ product }: { product: Product }) {
  const [active, setActive] = useState(product.active);
  const [images, setImages] = useState<string[]>(product.images);

  const boundAction = editProductAction.bind(null, product.id);
  const [state, action, pending] = useActionState(boundAction, {});

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <a href="/dashboard/produtos" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Editar produto</h2>
          <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
        </div>
      </div>

      <form action={action}>
        <input type="hidden" name="active" value={active ? "true" : "false"} />
        {images.map((url, i) => (
          <input key={i} type="hidden" name="images" value={url} />
        ))}

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Informações</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome do produto <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={product.name}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {state.errors?.name && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product.description ?? ""}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                <input
                  name="category"
                  type="text"
                  defaultValue={product.category?.name ?? ""}
                  placeholder="Ex: Camisetas, Calças, Leggings..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Fotos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <ImageUpload
                value={images}
                onChange={setImages}
                folder="products"
                max={6}
                label="Fotos do produto"
                hint="A primeira imagem será a capa. Até 6 imagens."
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Preço e estoque</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preço atual <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">R$</span>
                    <input
                      name="price"
                      type="number"
                      defaultValue={product.price}
                      step="0.01"
                      min="0"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {state.errors?.price && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.price[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preço antigo <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">R$</span>
                    <input
                      name="compareAtPrice"
                      type="number"
                      defaultValue={product.compareAtPrice ?? ""}
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {state.errors?.compareAtPrice && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.compareAtPrice[0]}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                O preço antigo aparecerá <span className="line-through">riscado</span> na loja para gerar ancoragem de valor e destacar o desconto.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estoque</label>
                <input
                  name="stock"
                  type="number"
                  defaultValue={product.stock}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3">Visibilidade</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Produto ativo</p>
                  <p className="text-xs text-gray-400 mt-0.5">Visível na sua loja</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${active ? "bg-primary-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${active ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100"
            >
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar alterações"}
            </button>
            <a
              href="/dashboard/produtos"
              className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
