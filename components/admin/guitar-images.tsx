"use client";

import * as React from "react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import {
  deleteGuitarImageAction,
  setImagePositionAction,
  uploadGuitarImageAction,
} from "@/app/admin/(panel)/guitarras/actions";

type Img = { id: string; url: string; position: number };

type Upload = {
  id: string;
  name: string;
  status: "pending" | "ok" | "error";
  error?: string;
};

export function GuitarImages({ guitarId, images }: { guitarId: string; images: Img[] }) {
  const [uploads, setUploads] = React.useState<Upload[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounter = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function uploadOne(file: File): Promise<{ ok: true } | { ok: false; error: string }> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadGuitarImageAction(guitarId, null, fd);
    if (res.ok) return { ok: true };
    return { ok: false, error: res.error ?? "Error desconocido." };
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      toast.error("Eliegí archivos de imagen (JPG, PNG, WebP, AVIF).");
      return;
    }
    const items: Upload[] = files.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      name: f.name,
      status: "pending",
    }));
    setUploads((prev) => [...prev, ...items]);

    // Subida en paralelo. Cada una actualiza su propio estado al terminar.
    const results = await Promise.all(
      files.map(async (file, idx) => {
        const item = items[idx];
        if (!item) return { ok: false as const, error: "Estado roto." };
        const res = await uploadOne(file);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === item.id
              ? { ...u, status: res.ok ? "ok" : "error", error: res.ok ? undefined : res.error }
              : u,
          ),
        );
        return res;
      }),
    );

    const ok = results.filter((r) => r.ok).length;
    const failed = results.length - ok;
    if (ok > 0) toast.success(`${ok} foto${ok === 1 ? "" : "s"} subida${ok === 1 ? "" : "s"}.`);
    if (failed > 0) toast.error(`${failed} foto${failed === 1 ? "" : "s"} falló${failed === 1 ? "" : "n"}.`);

    // Limpia las exitosas a los 3s; los errores se quedan visibles.
    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.status !== "ok"));
    }, 3000);

    if (inputRef.current) inputRef.current.value = "";
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current += 1;
    if (e.dataTransfer.items.length > 0) setIsDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      void handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="grid gap-5">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "rounded-md border-2 border-dashed px-5 py-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-foreground/40 bg-card/40",
        )}
      >
        <UploadCloud className="size-8 mx-auto text-muted-foreground" />
        <p className="mt-3 text-sm">
          <span className="font-medium">Soltá fotos acá</span> o hacé click para elegir
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WebP o AVIF. Podés subir varias a la vez.
        </p>
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) void handleFiles(e.target.files);
          }}
        />
      </div>

      {uploads.length > 0 ? (
        <ul className="grid gap-1.5">
          {uploads.map((u) => (
            <li
              key={u.id}
              className={cn(
                "flex items-center gap-3 text-xs rounded-sm border px-3 py-2",
                u.status === "pending" && "border-border bg-secondary/40",
                u.status === "ok" && "border-accent/40 bg-accent/5 text-accent",
                u.status === "error" && "border-destructive/40 bg-destructive/5 text-destructive",
              )}
            >
              <ImagePlus className="size-3.5 shrink-0" />
              <span className="flex-1 truncate">{u.name}</span>
              <span className="shrink-0">
                {u.status === "pending"
                  ? "Subiendo…"
                  : u.status === "ok"
                    ? "Lista"
                    : (u.error ?? "Falló")}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Todavía no hay fotos. La primera será la portada en el catálogo.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <ImageCard key={img.id} img={img} guitarId={guitarId} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ImageCard({ img, guitarId }: { img: Img; guitarId: string }) {
  const [pending, start] = useTransition();
  // En la UI mostramos posiciones 1-indexed: 1 = portada, 2, 3, ...
  // En la DB la columna sigue siendo 0-indexed para no romper datos viejos.
  const [pos, setPos] = React.useState(img.position + 1);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => setPos(img.position + 1), [img.position]);

  function commitPos(displayed: number) {
    const next = displayed - 1;
    if (!Number.isFinite(next) || next < 0 || next === img.position) return;
    start(async () => {
      await setImagePositionAction(img.id, guitarId, next);
      toast.success("Orden actualizado.");
    });
  }

  function handleConfirmDelete() {
    setConfirmOpen(false);
    start(async () => {
      await deleteGuitarImageAction(img.id, guitarId);
      toast.success("Foto borrada.");
    });
  }

  return (
    <>
      <li
        className={cn(
          "rounded-md overflow-hidden border border-border bg-card",
          pending && "opacity-50",
        )}
      >
        <div className="relative aspect-square bg-secondary">
          <Image src={img.url} alt="" fill sizes="200px" className="object-cover" />
          {img.position === 0 ? (
            <span className="absolute left-2 top-2 rounded-sm bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 uppercase tracking-widest">
              Portada
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 p-2">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Orden
            <Input
              type="number"
              min={1}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              onBlur={() => commitPos(pos)}
              className="h-7 w-14 px-2 text-xs"
            />
          </label>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={pending}
            className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-secondary"
            title="Borrar foto"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </li>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="¿Borrar esta foto?"
        description="La foto se elimina del storage permanentemente."
        confirmLabel="Borrar"
        destructive
        pending={pending}
      />
    </>
  );
}
