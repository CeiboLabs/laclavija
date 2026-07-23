"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "laclavija:promo-last-shown";

export type PromoConfigProps = {
  // updated_at sirve como "version": si la promo cambia, queremos volver a mostrar.
  version: string;
  title: string;
  message: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  imageUrl: string | null;
};

function todayKey() {
  // Fecha local YYYY-MM-DD del cliente.
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function PromoModal({ version, title, message, ctaLabel, ctaUrl, imageUrl }: PromoConfigProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const today = todayKey();
    const stored = window.localStorage.getItem(STORAGE_KEY);

    // stored = "YYYY-MM-DD|<version>"
    const [storedDay, storedVersion] = (stored ?? "").split("|");

    // Mostramos si: cambia el día, o la promo se actualizó desde la última vez.
    const shouldShow = storedDay !== today || storedVersion !== version;
    if (!shouldShow) return;

    // Pequeño delay para no aparecer junto con el hero — más amable.
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, [version]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, `${todayKey()}|${version}`);
    }
  }

  const hasCta = ctaLabel && ctaUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {imageUrl ? (
          <div className="relative -mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden bg-secondary">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="448px"
              className="object-cover"
            />
          </div>
        ) : null}
        <p className="text-xs uppercase tracking-[0.3em] text-accent">La Clavija</p>
        <DialogTitle className="mt-2 font-serif text-3xl tracking-tight leading-[1.1]">
          {title}
        </DialogTitle>
        {message ? (
          <DialogDescription className="mt-3 text-foreground/85 leading-relaxed whitespace-pre-wrap">
            {message}
          </DialogDescription>
        ) : null}
        {hasCta ? (
          <div className="mt-6 flex gap-3">
            <Button asChild variant="accent">
              <Link href={ctaUrl!} onClick={() => handleOpenChange(false)}>
                {ctaLabel}
              </Link>
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
