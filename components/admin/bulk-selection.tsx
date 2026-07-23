"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCheck, Percent, Square, SquareCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { setDiscountBulkAction } from "@/app/admin/(panel)/guitarras/actions";

type Ctx = {
  selected: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
  selectAll: (ids: string[]) => void;
};

const BulkCtx = React.createContext<Ctx | null>(null);

function useBulkCtx() {
  const ctx = React.useContext(BulkCtx);
  if (!ctx) throw new Error("BulkRowCheckbox/BulkActionsBar fuera de BulkSelectionProvider");
  return ctx;
}

export function BulkSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const ctx: Ctx = React.useMemo(
    () => ({
      selected,
      toggle: (id) =>
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      clear: () => setSelected(new Set()),
      selectAll: (ids) => setSelected(new Set(ids)),
    }),
    [selected],
  );
  return <BulkCtx.Provider value={ctx}>{children}</BulkCtx.Provider>;
}

export function BulkRowCheckbox({ id }: { id: string }) {
  const { selected, toggle } = useBulkCtx();
  const checked = selected.has(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-sm transition-colors",
        checked ? "text-accent" : "text-muted-foreground hover:text-foreground",
      )}
      aria-label={checked ? "Deseleccionar" : "Seleccionar"}
      aria-pressed={checked}
    >
      {checked ? <SquareCheck className="size-5" /> : <Square className="size-5" />}
    </button>
  );
}

export function BulkActionsBar({ allIds }: { allIds: string[] }) {
  const { selected, clear, selectAll } = useBulkCtx();
  const [pending, start] = useTransition();
  const [pct, setPct] = React.useState("");
  // Confirm pendiente: null = sin confirmar, number = aplicar X%, "clear" = quitar.
  const [confirming, setConfirming] = React.useState<number | "clear" | null>(null);

  const count = selected.size;
  if (count === 0) return null;

  function apply(percent: number | null) {
    const ids = Array.from(selected);
    start(async () => {
      const res = await setDiscountBulkAction(ids, percent);
      if (res.ok) {
        toast.success(
          percent === null
            ? `Descuento quitado a ${res.updated} guitarra${res.updated === 1 ? "" : "s"}.`
            : `${percent}% aplicado a ${res.updated} guitarra${res.updated === 1 ? "" : "s"}.`,
        );
        clear();
        setPct("");
        setConfirming(null);
      } else if (res.error) {
        toast.error(res.error);
        setConfirming(null);
      }
    });
  }

  function askApply() {
    const parsed = Number.parseInt(pct, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 99) {
      toast.error("Ingresá un descuento entre 1 y 99.");
      return;
    }
    setConfirming(parsed);
  }

  function askClear() {
    setConfirming("clear");
  }

  function onConfirm() {
    if (confirming === "clear") apply(null);
    else if (typeof confirming === "number") apply(confirming);
  }

  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-background/95 backdrop-blur border-b border-accent/40 mb-6 flex flex-wrap items-center gap-3">
      <p className="text-sm font-medium">
        Seleccionadas: <span className="text-accent tabular-nums">{count}</span>
      </p>

      <button
        type="button"
        onClick={() => (count === allIds.length ? clear() : selectAll(allIds))}
        disabled={pending}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <CheckCheck className="size-3.5" />
        {count === allIds.length ? "Deseleccionar todas" : `Seleccionar las ${allIds.length}`}
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            type="number"
            min={1}
            max={99}
            placeholder="%"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            disabled={pending}
            className="w-20 pl-6 tabular-nums"
            aria-label="Descuento a aplicar"
          />
          <Percent className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <Button
          type="button"
          size="sm"
          variant="accent"
          onClick={askApply}
          disabled={pending || !pct}
        >
          Aplicar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={askClear}
          disabled={pending}
        >
          Quitar descuento
        </Button>
        <button
          type="button"
          onClick={clear}
          disabled={pending}
          className="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          aria-label="Limpiar selección"
        >
          <X className="size-4" />
        </button>
      </div>

      <ConfirmDialog
        open={confirming !== null}
        onOpenChange={(next) => !pending && !next && setConfirming(null)}
        onConfirm={onConfirm}
        pending={pending}
        title={confirming === "clear" ? "¿Quitar descuento?" : "¿Aplicar descuento?"}
        description={
          confirming === "clear" ? (
            <>
              Vas a quitar el descuento de <span className="text-foreground">{count}</span> guitarra
              {count === 1 ? "" : "s"}. Las que no tenían descuento no cambian.
            </>
          ) : (
            <>
              Vas a aplicar <span className="text-accent">−{confirming}%</span> a{" "}
              <span className="text-foreground">{count}</span> guitarra{count === 1 ? "" : "s"}. Se ve en el
              catálogo público al instante.
            </>
          )
        }
        confirmLabel={confirming === "clear" ? "Quitar" : "Aplicar"}
      />
    </div>
  );
}
