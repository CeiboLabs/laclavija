"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Circle, CircleDot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "guitar", label: "Guitarras" },
  { value: "amp", label: "Amplificadores" },
  { value: "accessory", label: "Accesorios" },
] as const;

const TYPES = [
  { value: "electric", label: "Eléctrica" },
  { value: "acoustic", label: "Acústica" },
  { value: "classical", label: "Clásica" },
  { value: "bass", label: "Bajo" },
] as const;

const STATUSES = [
  { value: "available", label: "Disponible" },
  { value: "reserved", label: "Reservada" },
  { value: "sold", label: "Vendida" },
] as const;

const ALL = "__all__";

export function FilterForm({ brands, onApply }: { brands: string[]; onApply?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = React.useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = React.useState(params.get("maxPrice") ?? "");
  const [minYear, setMinYear] = React.useState(params.get("minYear") ?? "");
  const [maxYear, setMaxYear] = React.useState(params.get("maxYear") ?? "");

  React.useEffect(() => {
    setMinPrice(params.get("minPrice") ?? "");
    setMaxPrice(params.get("maxPrice") ?? "");
    setMinYear(params.get("minYear") ?? "");
    setMaxYear(params.get("maxYear") ?? "");
  }, [params]);

  function pushParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "" || value === ALL) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function commitNumber(key: string, value: string) {
    if (value === "") {
      pushParam(key, null);
      return;
    }
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return;
    pushParam(key, String(n));
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
    onApply?.();
  }

  const activeCategory = params.get("categoria");
  const activeType = params.get("type");
  const activeStatus = params.get("status") ?? "available";
  const activeBrand = params.get("brand");

  function setCategory(value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "" || value === ALL) next.delete("categoria");
    else next.set("categoria", value);
    // Cambiar de categoria limpia el filtro de tipo (solo aplica a guitarras).
    if (value !== "guitar") next.delete("type");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        onApply?.();
      }}
    >
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Categoría</Label>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(active ? null : c.value)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm text-center transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeCategory !== "amp" && activeCategory !== "accessory" && (
        <div>
          <Label className="mono-meta">Tipo</Label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {TYPES.map((t) => {
              const active = activeType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => pushParam("type", active ? null : t.value)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm text-left transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Marca</Label>
        <div className="mt-3">
          <Select
            value={activeBrand ?? ALL}
            onValueChange={(v) => pushParam("brand", v === ALL ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las marcas</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Precio (USD)</Label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Desde"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={(e) => commitNumber("minPrice", e.target.value)}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Hasta"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={(e) => commitNumber("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Año</Label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={1900}
            placeholder="Desde"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            onBlur={(e) => commitNumber("minYear", e.target.value)}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1900}
            placeholder="Hasta"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
            onBlur={(e) => commitNumber("maxYear", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Estado</Label>
        <div className="mt-3 flex flex-col gap-1.5">
          {STATUSES.map((s) => {
            const active = activeStatus === s.value;
            const Icon = active ? CircleDot : Circle;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => pushParam("status", s.value)}
                className={cn(
                  "flex items-center gap-2.5 text-left text-sm py-1.5 transition-colors",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-dashed border-border">
        <Button type="button" variant="ghost" size="sm" onClick={clearAll} className="justify-start gap-2 mono-meta">
          <X className="size-3" />
          Limpiar filtros
        </Button>
      </div>
    </form>
  );
}
