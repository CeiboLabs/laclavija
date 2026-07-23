"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORT_LABELS: Record<string, string> = {
  recent: "Más recientes",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "year-desc": "Año: más nuevo",
  "year-asc": "Año: más viejo",
};

export function CatalogToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initialQ = params.get("q") ?? "";
  const sort = params.get("sort") ?? "recent";
  const [q, setQ] = React.useState(initialQ);

  // Sync local state si cambia la URL desde afuera (ej: limpiar filtros).
  React.useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  function pushParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounce la busqueda para no pushear en cada tecla.
  React.useEffect(() => {
    if (q === (params.get("q") ?? "")) return;
    const t = setTimeout(() => pushParam("q", q.trim() || null), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function onSortChange(value: string) {
    pushParam("sort", value === "recent" ? null : value);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Buscar por marca o modelo (ej: stratocaster)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9 pr-9"
          aria-label="Buscar en el catálogo"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="sm:w-56" aria-label="Ordenar resultados">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
