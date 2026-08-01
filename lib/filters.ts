import type { CatalogFilters, CatalogSort } from "./queries";
import type { GuitarStatus, GuitarType, ProductCategory } from "./types";

const CATEGORIES = ["guitar", "amp", "accessory"] as const satisfies readonly ProductCategory[];
const TYPES = ["electric", "acoustic", "classical", "bass"] as const satisfies readonly GuitarType[];
const STATUSES = ["available", "reserved", "sold"] as const satisfies readonly GuitarStatus[];
const SORTS = ["recent", "price-asc", "price-desc", "year-desc", "year-asc"] as const satisfies readonly CatalogSort[];

export const SORT_OPTIONS = SORTS;

function parseInt32(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseEnum<T extends string>(value: string | string[] | undefined, allowed: readonly T[]): T | undefined {
  if (typeof value !== "string") return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

function parseString(value: string | string[] | undefined, maxLength = 80) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

export function parseFilters(searchParams: Record<string, string | string[] | undefined>): CatalogFilters {
  return {
    category: parseEnum(searchParams.categoria, CATEGORIES),
    type: parseEnum(searchParams.type, TYPES),
    brand: parseString(searchParams.brand),
    minPrice: parseInt32(searchParams.minPrice),
    maxPrice: parseInt32(searchParams.maxPrice),
    minYear: parseInt32(searchParams.minYear),
    maxYear: parseInt32(searchParams.maxYear),
    status: parseEnum(searchParams.status, STATUSES),
    q: parseString(searchParams.q),
    sort: parseEnum(searchParams.sort, SORTS) ?? "recent",
  };
}

/** Filtros que cuentan como "activos" en el chip count del catalogo.
 *  `sort` no cuenta (siempre tiene valor) y `status="available"` (default) tampoco. */
export function countActiveFilters(filters: CatalogFilters): number {
  let count = 0;
  if (filters.category) count++;
  if (filters.type) count++;
  if (filters.brand) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.minYear !== undefined) count++;
  if (filters.maxYear !== undefined) count++;
  if (filters.status && filters.status !== "available") count++;
  if (filters.q) count++;
  return count;
}

export const FILTER_LABELS: Record<Exclude<keyof CatalogFilters, "sort">, string> = {
  category: "Categoría",
  type: "Tipo",
  brand: "Marca",
  minPrice: "Desde",
  maxPrice: "Hasta",
  minYear: "Año desde",
  maxYear: "Año hasta",
  status: "Estado",
  q: "Búsqueda",
};
