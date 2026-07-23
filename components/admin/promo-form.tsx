"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import { toast } from "sonner";
import { ImagePlus, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmSubmitButton } from "@/components/ui/confirm-dialog";
import { savePromoAction, type SavePromoState } from "@/app/admin/(panel)/promo/actions";

type Initial = {
  active: boolean;
  title: string;
  message: string;
  cta_label: string | null;
  cta_url: string | null;
  expires_at: string | null;
  image_url: string | null;
};

// Convierte ISO → "YYYY-MM-DDTHH:mm" para <input type="datetime-local">
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PromoForm({ initial }: { initial: Initial }) {
  const [state, formAction] = useActionState<SavePromoState | null, FormData>(
    savePromoAction,
    null,
  );

  const [active, setActive] = React.useState(initial.active);
  const [title, setTitle] = React.useState(initial.title);
  const [message, setMessage] = React.useState(initial.message);
  const [ctaLabel, setCtaLabel] = React.useState(initial.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = React.useState(initial.cta_url ?? "");
  const [newImage, setNewImage] = React.useState<File | null>(null);
  const [removeImage, setRemoveImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const newImagePreview = React.useMemo(
    () => (newImage ? URL.createObjectURL(newImage) : null),
    [newImage],
  );
  React.useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  // Si suben una nueva, "remove" queda implícito.
  const effectiveImage = newImagePreview
    ? newImagePreview
    : removeImage
      ? null
      : initial.image_url;

  React.useEffect(() => {
    if (state?.ok) {
      toast.success("Promo guardada.");
      setNewImage(null);
      setRemoveImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <form action={formAction} className="grid gap-5">
        <label className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
          <input
            type="checkbox"
            name="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-input"
          />
          <div>
            <p className="text-sm font-medium">Activo en el sitio</p>
            <p className="text-xs text-muted-foreground">
              Cuando está activo, aparece la primera vez que un visitante entra al día.
            </p>
          </div>
        </label>

        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: 15% off esta semana"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ej: Hasta el viernes, todas las eléctricas con descuento. Coordiná visita."
          />
        </div>

        <div className="grid gap-2">
          <Label>Imagen (opcional)</Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Se optimiza y se convierte a WebP automáticamente. Si subís otra después, la
            anterior se borra del storage.
          </p>
          <div className="flex items-start gap-4">
            <div className="relative size-24 shrink-0 rounded-md border border-border bg-secondary overflow-hidden">
              {effectiveImage ? (
                <Image
                  src={effectiveImage}
                  alt="Imagen de la promo"
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <ImagePlus className="size-5" />
                </div>
              )}
            </div>
            <div className="grid gap-2 flex-1">
              <label className="inline-flex w-fit items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-1.5 text-xs cursor-pointer hover:border-accent hover:text-accent transition-colors">
                <ImagePlus className="size-3.5" />
                {newImage ? "Cambiar archivo" : effectiveImage ? "Reemplazar imagen" : "Elegir imagen"}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setNewImage(f);
                    if (f) setRemoveImage(false);
                  }}
                />
              </label>
              {newImage ? (
                <p className="text-xs text-muted-foreground truncate">{newImage.name}</p>
              ) : null}
              {initial.image_url && !newImage ? (
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="remove_image"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="rounded border-input"
                  />
                  Quitar imagen actual
                </label>
              ) : null}
              {newImage ? (
                <button
                  type="button"
                  onClick={() => {
                    setNewImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                  Cancelar nueva
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cta_label">Texto del botón (opcional)</Label>
            <Input
              id="cta_label"
              name="cta_label"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Ver guitarras"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cta_url">Link del botón (opcional)</Label>
            <Input
              id="cta_url"
              name="cta_url"
              type="url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="/catalogo o https://wa.me/…"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expires_at">Expira (opcional)</Label>
          <Input
            id="expires_at"
            name="expires_at"
            type="datetime-local"
            defaultValue={toLocalInput(initial.expires_at)}
            className="w-fit"
          />
          <p className="text-xs text-muted-foreground">
            Si dejás vacío, no expira. A partir de esta fecha y hora deja de mostrarse.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <ConfirmSubmitButton
            title={active ? "¿Activar promo modal?" : "¿Guardar promo?"}
            description={
              active
                ? "Va a aparecer en el sitio público a partir de ahora."
                : "Los cambios se guardan pero el modal queda inactivo."
            }
            confirmLabel="Guardar"
          >
            <Save className="size-4" />
            Guardar
          </ConfirmSubmitButton>
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        </div>
      </form>

      <div className="lg:sticky lg:top-10 self-start">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Preview</p>
        <PromoPreview
          active={active}
          title={title}
          message={message}
          ctaLabel={ctaLabel}
          ctaUrl={ctaUrl}
          imageUrl={effectiveImage}
        />
      </div>
    </div>
  );
}

function PromoPreview({
  active,
  title,
  message,
  ctaLabel,
  ctaUrl,
  imageUrl,
}: {
  active: boolean;
  title: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
}) {
  if (!active && !title && !message && !imageUrl) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Sin contenido todavía.
      </div>
    );
  }
  return (
    <div className="rounded-md border border-border bg-card shadow-xl overflow-hidden">
      {imageUrl ? (
        <div className="relative aspect-[16/9] bg-secondary">
          <Image src={imageUrl} alt="" fill sizes="500px" className="object-cover" unoptimized />
        </div>
      ) : null}
      <div className="p-6">
        {!active ? (
          <p className="mb-3 inline-block text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
            Vista previa — inactivo
          </p>
        ) : null}
        <h3 className="font-serif text-2xl tracking-tight">{title || "Sin título"}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {message || "Sin mensaje."}
        </p>
        {ctaLabel && ctaUrl ? (
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">
              {ctaLabel}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
