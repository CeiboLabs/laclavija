"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

interface GalleryProps {
  images: string[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(false);
  // Origen del zoom (en % del container), para que haga "zoom donde clickeo".
  const [origin, setOrigin] = React.useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const safe = images.length > 0 ? images : [];
  const current = safe[active];

  const go = React.useCallback(
    (delta: number) => {
      if (safe.length === 0) return;
      setActive((i) => (i + delta + safe.length) % safe.length);
      setZoom(false);
    },
    [safe.length],
  );

  // Reset zoom al cerrar el dialog.
  React.useEffect(() => {
    if (!open) setZoom(false);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  function onImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (zoom) {
      setZoom(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
    setZoom(true);
  }

  if (!current) {
    return (
      <div className="aspect-[4/5] w-full bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-sm">
        Sin fotos disponibles
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative aspect-[4/5] w-full overflow-hidden rounded-md bg-secondary cursor-zoom-in"
        aria-label="Ampliar foto"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Expand className="size-3" />
          Ampliar
        </div>
      </button>

      {safe.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {safe.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm bg-secondary transition-opacity hover:opacity-90",
                i === active ? "opacity-100" : "opacity-70",
              )}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              {i === active ? (
                <motion.span
                  layoutId="gallery-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-sm border-2 border-accent pointer-events-none"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-(--container-2xl) w-[95vw] p-0 bg-background border-border"
          hideClose
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div
            className={cn(
              "relative aspect-[4/3] w-full overflow-hidden select-none",
              zoom ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
            onClick={onImageClick}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: zoom ? "scale(2.2)" : "scale(1)",
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            >
              <Image src={current} alt={alt} fill sizes="95vw" className="object-contain" />
            </div>

            <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-xs uppercase tracking-wider">
              {zoom ? <ZoomOut className="size-3" /> : <ZoomIn className="size-3" />}
              {zoom ? "Click para alejar" : "Click para zoom"}
            </div>

            {safe.length > 1 && !zoom ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-background/70 backdrop-blur hover:bg-background border border-border transition-colors active:scale-95"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-background/70 backdrop-blur hover:bg-background border border-border transition-colors active:scale-95"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-wider pointer-events-none">
                  {active + 1} / {safe.length}
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
