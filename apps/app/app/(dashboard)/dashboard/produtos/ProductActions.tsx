"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, ToggleLeft, ToggleRight, Pencil } from "lucide-react";
import { toggleProductAction, deleteProductAction } from "@/app/actions/products";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Props {
  id: string;
  active: boolean;
}

export default function ProductActions({ id, active }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(true);
  };

  // fecha ao rolar ou redimensionar
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen(false);
    startTransition(async () => {
      await toggleProductAction(id, !active);
      router.refresh();
    });
  };

  const handleDelete = () => {
    setOpen(false);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setConfirmOpen(false);
    startTransition(async () => {
      await deleteProductAction(id);
      router.refresh();
    });
  };

  return (
    <>
      {confirmOpen && (
        <ConfirmModal
          title="Excluir produto"
          description="Tem certeza? Essa ação não pode ser desfeita e o produto será removido permanentemente."
          confirmLabel="Sim, excluir"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={isPending}
        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-40"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
            style={{ top: pos.top, right: pos.right }}
          >
            <a
              href={`/dashboard/produtos/${id}/editar`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </a>
            <button
              onClick={handleToggle}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {active
                ? <ToggleLeft className="w-4 h-4" />
                : <ToggleRight className="w-4 h-4 text-green-500" />}
              {active ? "Desativar" : "Ativar"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </>
      )}
    </>
  );
}
