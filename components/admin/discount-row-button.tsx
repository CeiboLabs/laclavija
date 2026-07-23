"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { setDiscountBulkAction } from "@/app/admin/(panel)/guitarras/actions";

export function RowDiscountButton({
  id,
  current,
  guitarLabel,
}: {
  id: string;
  current: number | null;
  guitarLabel: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pct, setPct] = React.useState<string>("");
  const [pending, start] = useTransition();

  // Cuando abre, precarga el valor actual.
  React.useEffect(() => {
    if (open) setPct(current ? String(current) : "");
  }, [open, current]);

  function apply(percent: number | null) {
    start(async () => {
      const res = await setDiscountBulkAction([id], percent);
      if (res.ok) {
        toast.success(
          percent === null
            ? `Descuento quitado de ${guitarLabel}.`
            : `${percent}% aplicado a ${guitarLabel}.`,
        );
        setOpen(false);
      } else if (res.error) {
        toast.error(res.error);
      }
    });
  }

  function onApplyClick() {
    const parsed = Number.parseInt(pct, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 99) {
      toast.error("Ingresá un descuento entre 1 y 99.");
      return;
    }
    apply(parsed);
  }

  const hasDiscount = typeof current === "number" && current > 0;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={hasDiscount ? "Editar descuento" : "Aplicar descuento"}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs font-bold tabular-nums transition-colors",
          hasDiscount
            ? "border-accent/40 bg-accent/15 text-accent hover:bg-accent/25"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
        )}
      >
        <Percent className="size-3" />
        {hasDiscount ? `${current}%` : "—"}
      </button>

      <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="font-serif text-2xl tracking-tight">
            {hasDiscount ? "Editar descuento" : "Aplicar descuento"}
          </DialogTitle>
          <DialogDescription className="text-foreground/85 leading-relaxed">
            <span className="text-foreground font-medium">{guitarLabel}</span>
            {hasDiscount ? (
              <>
                {" "}
                tiene actualmente <span className="text-accent">−{current}%</span>. Cambialo o quitalo.
              </>
            ) : (
              " — ingresá el porcentaje a aplicar."
            )}
          </DialogDescription>

          <div className="mt-4 grid gap-2">
            <Label htmlFor={`discount-${id}`}>Descuento</Label>
            <div className="relative max-w-32">
              <Input
                id={`discount-${id}`}
                type="number"
                min={1}
                max={99}
                value={pct}
                onChange={(e) => setPct(e.target.value)}
                disabled={pending}
                placeholder="ej: 15"
                className="pl-7 tabular-nums"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onApplyClick();
                  }
                }}
                autoFocus
              />
              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground">Entre 1 y 99. Aplica al instante en el catálogo.</p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            {hasDiscount ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => apply(null)}
                disabled={pending}
              >
                Quitar descuento
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={onApplyClick}
                disabled={pending || !pct}
              >
                {pending ? "…" : "Aplicar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
