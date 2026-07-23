"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmSubmitButton } from "@/components/ui/confirm-dialog";
import { SpecsEditor } from "./specs-editor";
import type { Guitar } from "@/lib/types";
import type { SaveGuitarState } from "@/app/admin/(panel)/guitarras/actions";

export type GuitarFormInitial = Partial<
  Pick<
    Guitar,
    | "brand"
    | "model"
    | "year"
    | "type"
    | "price_usd"
    | "price_uyu"
    | "discount_percent"
    | "status"
    | "featured"
    | "short_description"
    | "long_description"
    | "specs"
    | "slug"
  >
>;

export function GuitarForm({
  action,
  initial,
  submitLabel,
  mode,
}: {
  action: (
    prev: SaveGuitarState | null,
    formData: FormData,
  ) => Promise<SaveGuitarState>;
  initial?: GuitarFormInitial;
  submitLabel: string;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useActionState<SaveGuitarState | null, FormData>(action, null);
  const isNew = mode === "create";
  const lastSeen = React.useRef<SaveGuitarState | null>(null);
  const [yearUnknown, setYearUnknown] = React.useState(
    initial !== undefined && (initial.year === null || initial.year === undefined),
  );

  // Toasts según resultado (en edit; create hace redirect y no llega).
  React.useEffect(() => {
    if (!state || state === lastSeen.current) return;
    lastSeen.current = state;
    if (state.ok) toast.success("Cambios guardados.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="brand" label="Marca *">
          <Input id="brand" name="brand" defaultValue={initial?.brand ?? ""} required />
        </Field>
        <Field id="model" label="Modelo *">
          <Input id="model" name="model" defaultValue={initial?.model ?? ""} required />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="year" label="Año">
          <div className="grid gap-1.5">
            <Input
              id="year"
              name="year"
              type="number"
              min={1900}
              max={2100}
              defaultValue={initial?.year ?? ""}
              disabled={yearUnknown}
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                name="year_unknown"
                checked={yearUnknown}
                onChange={(e) => setYearUnknown(e.target.checked)}
                className="rounded border-input"
              />
              Año desconocido
            </label>
          </div>
        </Field>
        <Field id="type" label="Tipo *">
          <select
            id="type"
            name="type"
            defaultValue={initial?.type ?? "electric"}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
            required
          >
            <option value="electric">Eléctrica</option>
            <option value="acoustic">Acústica</option>
            <option value="classical">Clásica</option>
            <option value="bass">Bajo</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-2">
        <Label>Precios</Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Cargá al menos uno. Si dejás ambos vacíos, no se va a poder guardar.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="price_usd" label="USD">
            <Input
              id="price_usd"
              name="price_usd"
              type="number"
              min={0}
              defaultValue={initial?.price_usd ?? ""}
              placeholder="ej: 2400"
            />
          </Field>
          <Field id="price_uyu" label="UYU">
            <Input
              id="price_uyu"
              name="price_uyu"
              type="number"
              min={0}
              defaultValue={initial?.price_uyu ?? ""}
              placeholder="ej: 95000"
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="discount_percent">Descuento (%)</Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Opcional. Si cargás un número entre 1 y 99, en el catálogo aparece el precio tachado y el
          nuevo precio con badge <span className="text-accent">−X%</span>. Dejá vacío para sin descuento.
        </p>
        <Input
          id="discount_percent"
          name="discount_percent"
          type="number"
          min={0}
          max={99}
          step={1}
          defaultValue={initial?.discount_percent ?? ""}
          placeholder="ej: 15"
          className="sm:max-w-40"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <Field id="status" label="Estado">
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "available"}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
          >
            <option value="available">Disponible</option>
            <option value="reserved">Reservada</option>
            <option value="sold">Vendida</option>
          </select>
        </Field>
        <Field id="slug" label={isNew ? "Slug (se autogenera si lo dejás vacío)" : "Slug"}>
          <Input id="slug" name="slug" defaultValue={initial?.slug ?? ""} />
        </Field>
        <label className="flex items-center gap-2 h-10">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial?.featured ?? false}
            className="rounded border-input"
          />
          <span className="text-sm">Destacada</span>
        </label>
      </div>

      <Field id="short_description" label="Descripción corta">
        <Textarea
          id="short_description"
          name="short_description"
          rows={2}
          defaultValue={initial?.short_description ?? ""}
          placeholder="Una línea o dos. Aparece en la card del catálogo."
        />
      </Field>

      <Field id="long_description" label="Descripción larga">
        <Textarea
          id="long_description"
          name="long_description"
          rows={8}
          defaultValue={initial?.long_description ?? ""}
          placeholder="La historia. Separá párrafos con doble salto de línea."
        />
      </Field>

      <div className="grid gap-2">
        <Label>Especificaciones</Label>
        <SpecsEditor initial={initial?.specs} />
      </div>

      {isNew ? (
        <p className="text-xs text-muted-foreground rounded-md border border-dashed border-border bg-card/40 px-4 py-3">
          Las fotos se suben después, una por una, desde la pantalla de edición que se abre apenas publiques.
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <ConfirmSubmitButton
          title={isNew ? "¿Publicar guitarra?" : "¿Guardar cambios?"}
          description={
            isNew
              ? "Se va a publicar en el catálogo público al instante."
              : "Los cambios se reflejan en el sitio público en pocos segundos."
          }
          confirmLabel={isNew ? "Publicar" : "Guardar"}
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

