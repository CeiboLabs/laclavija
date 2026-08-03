"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmSubmitButton } from "@/components/ui/confirm-dialog";
import { BlogEditor } from "./blog-editor";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image-compress";
import type { AdminBlogPostRow } from "@/lib/admin/queries";
import type { SaveBlogPostState } from "@/app/admin/(panel)/blog/actions";

export type BlogFormInitial = Pick<
  AdminBlogPostRow,
  "id" | "title" | "subtitle" | "content" | "slug" | "published" | "cover_image_url"
> | null;

export function BlogForm({
  action,
  initial,
  mode,
  submitLabel,
}: {
  action: (prev: SaveBlogPostState | null, formData: FormData) => Promise<SaveBlogPostState>;
  initial?: BlogFormInitial;
  mode: "create" | "edit";
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<SaveBlogPostState | null, FormData>(action, null);
  const lastSeen = React.useRef<SaveBlogPostState | null>(null);
  const isNew = mode === "create";

  const [coverPreview, setCoverPreview] = React.useState<string | null>(initial?.cover_image_url ?? null);
  const [hasNewFile, setHasNewFile] = React.useState(false);
  const [removeCover, setRemoveCover] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [compressing, setCompressing] = React.useState(false);

  React.useEffect(() => {
    if (!state || state === lastSeen.current) return;
    lastSeen.current = state;
    if (state.ok) toast.success("Cambios guardados.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setCompressing(true);
    let optimized: File;
    try {
      optimized = await compressImage(file, "cover");
    } catch (err) {
      toast.error(`No se pudo optimizar la imagen: ${(err as Error).message}`);
      setCompressing(false);
      return;
    }
    // Inyectar el file (ya comprimido) en el input siempre montado, para que
    // llegue al FormData del form al hacer submit.
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(optimized);
      fileInputRef.current.files = dt.files;
    }
    setHasNewFile(true);
    setRemoveCover(false);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(optimized);
    setCompressing(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }

  function handleRemove() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setHasNewFile(false);
    setCoverPreview(null);
    setRemoveCover(true);
  }

  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <form action={formAction} className="grid gap-6">
      <Field id="title" label="Título *">
        <Input id="title" name="title" defaultValue={initial?.title ?? ""} required maxLength={200} />
      </Field>

      <Field id="subtitle" label="Subtítulo (opcional)">
        <Input id="subtitle" name="subtitle" defaultValue={initial?.subtitle ?? ""} />
      </Field>

      <Field id="slug" label={isNew ? "Slug (se autogenera si lo dejás vacío)" : "Slug"}>
        <Input id="slug" name="slug" defaultValue={initial?.slug ?? ""} />
        <p className="text-xs text-muted-foreground">
          URL del post: <span className="font-mono">/blog/{"{slug}"}</span>
        </p>
      </Field>

      <div className="grid gap-2">
        <Label>Portada</Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Aparece en el listado del blog y como imagen de OpenGraph al compartir. Máx 8MB.
        </p>

        {/* Input siempre montado — evita que React lo desmonte al cambiar la UI y pierda el archivo */}
        <input
          ref={fileInputRef}
          type="file"
          name="cover"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {removeCover ? <input type="hidden" name="remove_cover" value="on" /> : null}

        {coverPreview ? (
          <div className="relative overflow-hidden rounded-md border border-border bg-secondary">
            <div className="relative aspect-[16/9] w-full">
              {coverPreview.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Portada" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Image src={coverPreview} alt="Portada" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-background/85 backdrop-blur px-3 py-1.5 text-xs hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <X className="size-3.5" />
              Quitar
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={triggerFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerFilePicker();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-card/40 px-4 py-10 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
              "hover:border-accent/60 hover:bg-card/60",
              dragActive && "border-accent bg-accent/5",
            )}
          >
            <Upload className={cn("size-6", compressing ? "text-accent animate-pulse" : "text-muted-foreground")} />
            <div className="text-sm">
              {compressing ? (
                <span className="font-medium text-accent">Optimizando imagen…</span>
              ) : (
                <>
                  <span className="font-medium">Arrastrá una imagen</span> o hacé click para elegir
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG o WebP — se convierte a WebP automáticamente</p>
          </div>
        )}

        {compressing && coverPreview ? (
          <p className="text-xs text-accent">Optimizando imagen…</p>
        ) : null}

        {coverPreview && !hasNewFile && !removeCover ? (
          <button
            type="button"
            onClick={triggerFilePicker}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline text-left"
          >
            Reemplazar portada
          </button>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label>Contenido *</Label>
        <BlogEditor name="content" initialHtml={initial?.content ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? false}
          className="rounded border-input"
        />
        <Label htmlFor="published" className="font-normal">
          Publicado (visible en el sitio)
        </Label>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <ConfirmSubmitButton
          title={isNew ? "¿Crear post?" : "¿Guardar cambios?"}
          description={
            isNew
              ? "Se guarda como borrador o publicado según el toggle."
              : "Los cambios se reflejan en el sitio público en pocos segundos."
          }
          confirmLabel={isNew ? "Crear" : "Guardar"}
        >
          <Save className="size-4" />
          {submitLabel}
        </ConfirmSubmitButton>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
