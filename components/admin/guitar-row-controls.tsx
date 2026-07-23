"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Copy, Star } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import type { GuitarStatus } from "@/lib/types";
import {
  duplicateGuitarAction,
  setFeaturedAction,
  setStatusAction,
} from "@/app/admin/(panel)/guitarras/actions";

const STATUSES: GuitarStatus[] = ["available", "reserved", "sold"];
const STATUS_LABEL: Record<GuitarStatus, string> = {
  available: "Disponible",
  reserved: "Reservada",
  sold: "Vendida",
};

export function StatusSelect({ id, value }: { id: string; value: GuitarStatus }) {
  const [pending, start] = useTransition();
  const [pendingValue, setPendingValue] = React.useState<GuitarStatus | null>(null);

  function tryChange(next: GuitarStatus) {
    if (next === value) return;
    setPendingValue(next);
  }

  function commit() {
    const next = pendingValue;
    if (!next) return;
    setPendingValue(null);
    start(async () => {
      await setStatusAction(id, next);
      toast.success(`Marcada como ${STATUS_LABEL[next].toLowerCase()}.`);
    });
  }

  return (
    <>
      <select
        disabled={pending}
        value={value}
        onChange={(e) => tryChange(e.target.value as GuitarStatus)}
        className={cn(
          "rounded-md border border-input bg-background px-2 py-1 text-xs",
          pending && "opacity-50",
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <ConfirmDialog
        open={pendingValue !== null}
        onOpenChange={(next) => !next && setPendingValue(null)}
        onConfirm={commit}
        title={pendingValue ? `¿Marcar como ${STATUS_LABEL[pendingValue].toLowerCase()}?` : ""}
        description={
          pendingValue === "sold"
            ? "Va a aparecer en el catálogo como vendida (con foto en gris)."
            : pendingValue === "reserved"
              ? "Va a aparecer en el catálogo como reservada."
              : "Va a aparecer en el catálogo como disponible."
        }
        confirmLabel="Sí, cambiar"
        destructive={pendingValue === "sold"}
      />
    </>
  );
}

export function FeaturedToggle({ id, value }: { id: string; value: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await setFeaturedAction(id, !value);
          toast.success(value ? "Sacada de destacadas." : "Marcada como destacada.");
        })
      }
      title={value ? "Quitar de destacadas" : "Marcar como destacada"}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        value ? "text-accent hover:bg-accent/10" : "text-muted-foreground hover:bg-secondary",
        pending && "opacity-50",
      )}
    >
      <Star className="size-4" fill={value ? "currentColor" : "none"} />
    </button>
  );
}

export function DuplicateButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = React.useState(false);

  function confirm() {
    setOpen(false);
    start(async () => {
      try {
        await duplicateGuitarAction(id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "No se pudo duplicar.";
        // El action hace redirect en exito; si ves toast es porque fallo.
        if (!msg.includes("NEXT_REDIRECT")) toast.error(msg);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        title="Duplicar guitarra"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
          pending && "opacity-50",
        )}
      >
        <Copy className="size-4" />
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirm}
        title="¿Duplicar guitarra?"
        description="Se crea una copia con los mismos datos pero sin fotos y como disponible. Te lleva directo a la pantalla de edicion para ajustarla."
        confirmLabel="Duplicar"
      />
    </>
  );
}
