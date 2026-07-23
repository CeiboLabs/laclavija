"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ConfirmActionButton } from "@/components/ui/confirm-dialog";
import { deleteGuitarAction } from "@/app/admin/(panel)/guitarras/actions";

export function DeleteGuitarButton({ id, label }: { id: string; label: string }) {
  const [, start] = useTransition();
  return (
    <ConfirmActionButton
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      destructive
      title={`Borrar ${label}`}
      description="Se elimina la guitarra y todas sus fotos del storage. Esta acción no se puede deshacer."
      confirmLabel="Borrar"
      onConfirm={() =>
        new Promise<void>((resolve) => {
          start(async () => {
            try {
              await deleteGuitarAction(id);
              // No alcanza a llegar acá porque la action hace redirect.
              resolve();
            } catch {
              toast.error("No se pudo borrar.");
              resolve();
            }
          });
        })
      }
    >
      <Trash2 className="size-4" />
      Borrar guitarra
    </ConfirmActionButton>
  );
}
