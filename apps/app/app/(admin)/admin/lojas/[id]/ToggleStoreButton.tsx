"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Props {
  storeId: string;
  active: boolean;
}

export default function ToggleStoreButton({ storeId, active }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    setShowModal(false);
    startTransition(async () => {
      const res = await fetch(`/api/admin/stores/${storeId}/toggle`, { method: "PATCH" });
      if (!res.ok) return;
      router.refresh();
    });
  }

  return (
    <>
      {showModal && (
        <ConfirmModal
          title={active ? "Desativar loja?" : "Reativar loja?"}
          description={
            active
              ? "A loja ficará offline e os clientes não poderão acessar até ser reativada."
              : "A loja voltará a ficar online imediatamente."
          }
          confirmLabel={active ? "Sim, desativar" : "Sim, reativar"}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
      <button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
          active
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-green-50 text-green-600 hover:bg-green-100"
        }`}
      >
        {isPending ? "Salvando..." : active ? "Desativar" : "Reativar"}
      </button>
    </>
  );
}
