"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";

type Common = {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  pending,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
}: Common & {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle className="font-serif text-2xl tracking-tight">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="text-foreground/85 leading-relaxed">
            {description}
          </DialogDescription>
        ) : null}
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "accent"}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? "…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ButtonStylingProps = Pick<ButtonProps, "variant" | "size" | "className">;

/**
 * Botón que dispara un ConfirmDialog antes de ejecutar la acción.
 * Útil para borrar items, cambiar status, etc.
 */
export function ConfirmActionButton({
  children,
  variant,
  size,
  className,
  disabled,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
}: Common &
  ButtonStylingProps & {
    children: React.ReactNode;
    disabled?: boolean;
    onConfirm: () => void | Promise<void>;
  }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || pending}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => !pending && setOpen(next)}
        onConfirm={handleConfirm}
        pending={pending}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        destructive={destructive}
      />
    </>
  );
}

/**
 * Botón type="button" que valida + confirma + submitea el form padre.
 * Reemplaza al submit normal de un <form>.
 */
export function ConfirmSubmitButton({
  children,
  variant = "accent",
  size,
  className,
  disabled,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
}: Common &
  ButtonStylingProps & {
    children: React.ReactNode;
    disabled?: boolean;
  }) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleClick() {
    const form = btnRef.current?.closest("form");
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setOpen(true);
  }

  function handleConfirm() {
    const form = btnRef.current?.closest("form");
    if (!form) return;
    setOpen(false);
    form.requestSubmit();
  }

  return (
    <>
      <Button
        ref={btnRef}
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        destructive={destructive}
      />
    </>
  );
}
