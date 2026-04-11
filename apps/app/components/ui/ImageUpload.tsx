"use client";

import { useState, useCallback, useRef } from "react";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: "products" | "logos";
  max?: number;
  label?: string;
  hint?: string;
  /** Single-image mode (e.g. logo) */
  single?: boolean;
}

interface UploadingFile {
  id: string;
  name: string;
  preview: string;
  progress: number;
  error?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  max = 6,
  label = "Imagens",
  hint,
  single = false,
}: Props) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const effectiveMax = single ? 1 : max;

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const id = crypto.randomUUID();
      const preview = URL.createObjectURL(file);

      setUploading((prev) => [...prev, { id, name: file.name, preview, progress: 0 }]);

      try {
        // 1. Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: file.type,
            contentLength: file.size,
            folder,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao gerar URL de upload");
        }

        const { uploadUrl, publicUrl } = await res.json();

        setUploading((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress: 30 } : u))
        );

        // 2. PUT directly to R2
        const upload = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!upload.ok) throw new Error("Falha no upload para R2");

        setUploading((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress: 100 } : u))
        );

        // Small delay for UX before removing from uploading state
        await new Promise((r) => setTimeout(r, 300));
        setUploading((prev) => prev.filter((u) => u.id !== id));
        URL.revokeObjectURL(preview);

        return publicUrl;
      } catch (err: any) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, error: err.message, progress: 0 } : u
          )
        );
        return null;
      }
    },
    [folder]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const slots = effectiveMax - value.length;
      const toUpload = fileArray.slice(0, Math.max(0, slots));
      if (toUpload.length === 0) return;

      const results = await Promise.all(toUpload.map(uploadFile));
      const urls = results.filter(Boolean) as string[];

      if (urls.length > 0) {
        if (single) {
          onChange(urls.slice(0, 1));
        } else {
          onChange([...value, ...urls]);
        }
      }
    },
    [value, onChange, effectiveMax, single, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const removeUploadError = (id: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  };

  const canAdd = value.length + uploading.length < effectiveMax;

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
      )}

      {/* Preview grid */}
      {(value.length > 0 || uploading.length > 0) && (
        <div className={clsx("grid gap-3", single ? "grid-cols-1 max-w-[160px]" : "grid-cols-3 sm:grid-cols-4")}>
          {value.map((url, i) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group ring-1 ring-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && !single && value.length > 1 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg font-semibold tracking-wide">
                  CAPA
                </span>
              )}
            </div>
          ))}

          {/* Uploading items */}
          {uploading.map((u) => (
            <div
              key={u.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.preview} alt="" className="w-full h-full object-cover opacity-50" />
              {u.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 p-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mb-1" />
                  <p className="text-[10px] text-red-600 text-center leading-tight">{u.error}</p>
                  <button
                    type="button"
                    onClick={() => removeUploadError(u.id)}
                    className="mt-1 text-[10px] text-red-500 underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                    <span className="text-xs font-medium text-gray-600">{u.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAdd && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl p-6 text-center cursor-pointer transition-colors group"
        >
          <ImagePlus className="w-8 h-8 text-gray-300 group-hover:text-primary-400 mx-auto mb-2 transition-colors" />
          <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            <span className="font-semibold text-primary-600">Clique para selecionar</span>{" "}
            ou arraste {single ? "a imagem" : "as imagens"} aqui
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, WebP ou AVIF. Máx. 5 MB{!single && ` (até ${effectiveMax} imagens)`}.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple={!single}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
