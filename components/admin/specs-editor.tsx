"use client";

import * as React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { GuitarSpecs } from "@/lib/types";

type FieldKind = "text" | "number" | "list";

type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
};

// Lista de specs predefinidas. El orden acá es el orden en que aparecen
// en el dropdown de "agregar".
const PREDEFINED: FieldDef[] = [
  { key: "body_wood", label: "Madera del cuerpo", kind: "text", placeholder: "Aliso, caoba…" },
  { key: "neck_wood", label: "Madera del mástil", kind: "text", placeholder: "Maple, caoba…" },
  { key: "fretboard", label: "Diapasón", kind: "text", placeholder: "Palorrosa, ébano, maple…" },
  { key: "pickups", label: "Pastillas", kind: "text", placeholder: "2x Humbucker, 3x Single-coil…" },
  { key: "scale_length", label: "Escala", kind: "text", placeholder: '648 mm (25.5")' },
  { key: "finish", label: "Acabado / Color", kind: "text", placeholder: "Sunburst, ebony…" },
  { key: "weight_kg", label: "Peso (kg)", kind: "number", placeholder: "3.8" },
  { key: "case", label: "Estuche / Funda", kind: "text", placeholder: "Estuche rígido Fender" },
  { key: "serial", label: "Número de serie", kind: "text" },
  { key: "condition", label: "Estado / Condición", kind: "text", placeholder: "Muy bueno, refretteada…" },
  { key: "accessories", label: "Accesorios", kind: "list", placeholder: "Estuche, cable, llave…" },
];

const PREDEFINED_BY_KEY = new Map(PREDEFINED.map((f) => [f.key, f]));

type Entry = {
  id: string; // estable para React keys
  key: string;
  label: string;
  kind: FieldKind;
  predefined: boolean;
  textValue: string;
  numberValue: string;
  listValue: string[];
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function entryFromKnown(def: FieldDef): Entry {
  return {
    id: newId(),
    key: def.key,
    label: def.label,
    kind: def.kind,
    predefined: true,
    textValue: "",
    numberValue: "",
    listValue: [],
  };
}

function entriesFromSpecs(specs: GuitarSpecs | undefined | null): Entry[] {
  if (!specs) return [];
  const out: Entry[] = [];
  for (const [key, value] of Object.entries(specs)) {
    const def = PREDEFINED_BY_KEY.get(key);
    if (def) {
      const e = entryFromKnown(def);
      if (def.kind === "text") e.textValue = value == null ? "" : String(value);
      else if (def.kind === "number") e.numberValue = value == null ? "" : String(value);
      else if (def.kind === "list")
        e.listValue = Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];
      out.push(e);
    } else {
      // Spec personalizada: inferimos tipo del valor.
      const kind: FieldKind = Array.isArray(value)
        ? "list"
        : typeof value === "number"
          ? "number"
          : "text";
      const e: Entry = {
        id: newId(),
        key,
        label: key,
        kind,
        predefined: false,
        textValue: kind === "text" ? (value == null ? "" : String(value)) : "",
        numberValue: kind === "number" ? String(value) : "",
        listValue: kind === "list" && Array.isArray(value) ? value.map(String) : [],
      };
      out.push(e);
    }
  }
  return out;
}

function entriesToSpecs(entries: Entry[]): GuitarSpecs {
  const out: GuitarSpecs = {};
  for (const e of entries) {
    const key = e.key.trim();
    if (!key) continue;
    if (e.kind === "text") {
      const v = e.textValue.trim();
      if (v) out[key] = v;
    } else if (e.kind === "number") {
      const v = e.numberValue.trim();
      if (v) {
        const n = Number(v);
        if (Number.isFinite(n)) out[key] = n;
      }
    } else if (e.kind === "list") {
      const items = e.listValue.map((s) => s.trim()).filter(Boolean);
      if (items.length) out[key] = items;
    }
  }
  return out;
}

export function SpecsEditor({ initial }: { initial?: GuitarSpecs | null }) {
  const [entries, setEntries] = React.useState<Entry[]>(() => entriesFromSpecs(initial));
  const [adding, setAdding] = React.useState(false);

  const usedKeys = new Set(entries.map((e) => e.key));
  const availableDefs = PREDEFINED.filter((d) => !usedKeys.has(d.key));

  const json = JSON.stringify(entriesToSpecs(entries));

  function update(id: string, patch: Partial<Entry>) {
    setEntries((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    setEntries((es) => es.filter((e) => e.id !== id));
  }

  function addPredefined(key: string) {
    const def = PREDEFINED_BY_KEY.get(key);
    if (!def) return;
    setEntries((es) => [...es, entryFromKnown(def)]);
    setAdding(false);
  }

  function addCustom() {
    setEntries((es) => [
      ...es,
      {
        id: newId(),
        key: "",
        label: "",
        kind: "text",
        predefined: false,
        textValue: "",
        numberValue: "",
        listValue: [],
      },
    ]);
    setAdding(false);
  }

  return (
    <div className="grid gap-3">
      {/* Hidden input que se manda al server action — mantiene el contrato existente. */}
      <input type="hidden" name="specs" value={json} />

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Sin specs todavía. Agregá las que correspondan abajo.
        </p>
      ) : (
        <ul className="grid gap-2">
          {entries.map((e) => (
            <li key={e.id} className="rounded-md border border-border bg-card p-3">
              <SpecRow entry={e} onChange={(p) => update(e.id, p)} onRemove={() => remove(e.id)} />
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="rounded-md border border-border bg-card p-3 grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Elegí qué agregar
            </p>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Cancelar"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableDefs.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => addPredefined(d.key)}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                {d.label}
              </button>
            ))}
            <button
              type="button"
              onClick={addCustom}
              className="rounded-md border border-dashed border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
            >
              Personalizado…
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
        >
          <Plus className="size-4" />
          Agregar especificación
        </button>
      )}
    </div>
  );
}

function SpecRow({
  entry,
  onChange,
  onRemove,
}: {
  entry: Entry;
  onChange: (patch: Partial<Entry>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 grid sm:grid-cols-[minmax(160px,200px)_1fr] gap-2 items-start">
          {entry.predefined ? (
            <div className="flex items-center h-10 px-3 rounded-md bg-secondary text-sm">
              {entry.label}
            </div>
          ) : (
            <Input
              value={entry.label}
              onChange={(ev) => {
                const label = ev.target.value;
                // Sincronizamos label → key normalizado.
                const key = label
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[̀-ͯ]/g, "")
                  .replace(/[^a-z0-9]+/g, "_")
                  .replace(/^_+|_+$/g, "");
                onChange({ label, key });
              }}
              placeholder="Nombre del campo"
              className="h-10"
            />
          )}

          {entry.kind === "text" ? (
            <Input
              value={entry.textValue}
              onChange={(ev) => onChange({ textValue: ev.target.value })}
              placeholder={PREDEFINED_BY_KEY.get(entry.key)?.placeholder ?? "Valor"}
            />
          ) : entry.kind === "number" ? (
            <Input
              type="number"
              step="0.01"
              value={entry.numberValue}
              onChange={(ev) => onChange({ numberValue: ev.target.value })}
              placeholder={PREDEFINED_BY_KEY.get(entry.key)?.placeholder ?? "0"}
            />
          ) : (
            <ListEditor
              values={entry.listValue}
              onChange={(listValue) => onChange({ listValue })}
              placeholder={PREDEFINED_BY_KEY.get(entry.key)?.placeholder ?? "Item"}
            />
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors mt-0.5"
          title="Quitar"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function ListEditor({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      {values.length === 0 ? null : (
        <ul className="grid gap-1.5">
          {values.map((v, i) => (
            <li key={i} className="flex items-center gap-2">
              <Input
                value={v}
                onChange={(ev) => {
                  const next = [...values];
                  next[i] = ev.target.value;
                  onChange(next);
                }}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Quitar item"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
      >
        <Plus className="size-3" />
        Agregar item
      </button>
    </div>
  );
}
