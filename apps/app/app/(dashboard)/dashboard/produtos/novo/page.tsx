"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Save, X, Plus, ImagePlus } from "lucide-react";
import { createProductAction } from "@/app/actions/products";

export default function NovoProdutoPage() {
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [state, action, pending] = useActionState(createProductAction, {});

  const addImage = () => {
    const url = imageInput.trim();
    if (!url || images.length >= 6) return;
    setImages([...images, url]);
    setImageInput("");
  };

  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <a href="/dashboard/produtos" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Novo produto</h2>
          <p className="text-sm text-gray-500 mt-0.5">Preencha os dados do produto.</p>
        </div>
      </div>

      <form action={action}>
        <input type="hidden" name="active" value={active ? "true" : "false"} />
        {/* imagens como campos hidden */}
        {images.map((url, i) => (
          <input key={i} type="hidden" name="images" value={url} />
        ))}

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-5">
            {/* Informações */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Informações</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome do produto <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Camiseta Básica Preta M"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
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
                  placeholder="Descreva o produto, materiais, tamanhos disponíveis..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                <input
                  name="category"
                  type="text"
                  placeholder="Ex: Camisetas, Calças, Leggings..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Digite livremente — a categoria é criada automaticamente.</p>
              </div>
            </div>

            {/* Fotos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900">Fotos do produto</h3>
                <p className="text-sm text-gray-400 mt-0.5">Cole a URL de uma imagem (até 6). A primeira será a capa.</p>
              </div>

              {/* Pré-visualização */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-gray-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-md font-medium">
                          Capa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Input de URL */}
              {images.length < 6 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    disabled={!imageInput.trim()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
              )}

              {images.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Cole a URL de uma imagem acima para adicioná-la.</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-5">
            {/* Preço e estoque */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Preço e estoque</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Preço (R$) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">R$</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                {state.errors?.price && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.price[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estoque</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  defaultValue="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Visibilidade */}
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

            {/* Salvar */}
            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100"
            >
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar produto"}
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
