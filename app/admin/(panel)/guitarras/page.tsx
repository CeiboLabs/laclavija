import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DuplicateButton, FeaturedToggle, StatusSelect } from "@/components/admin/guitar-row-controls";
import {
  BulkActionsBar,
  BulkRowCheckbox,
  BulkSelectionProvider,
} from "@/components/admin/bulk-selection";
import { RowDiscountButton } from "@/components/admin/discount-row-button";
import { listAdminGuitars } from "@/lib/admin/queries";
import { applyDiscount, categoryLabel, formatPrice, formatPrimaryPrice, guitarTypeLabel } from "@/lib/format";
import type { GuitarStatus, GuitarType, ProductCategory } from "@/lib/types";

type Search = Record<string, string | string[] | undefined>;

const TYPES: GuitarType[] = ["electric", "acoustic", "classical", "bass"];
const CATEGORIES: ProductCategory[] = ["guitar", "amp", "accessory"];

function typeOrCategoryLabel(g: { category: ProductCategory; type: GuitarType | null }) {
  if (g.category === "amp") return "Amplificador";
  if (g.category === "accessory") return "Accesorio";
  return guitarTypeLabel(g.type);
}

function parseFilters(sp: Search) {
  const q = typeof sp.q === "string" ? sp.q : "";
  const category =
    typeof sp.category === "string" && (CATEGORIES as string[]).includes(sp.category)
      ? (sp.category as ProductCategory)
      : undefined;
  const type =
    typeof sp.type === "string" && (TYPES as string[]).includes(sp.type)
      ? (sp.type as GuitarType)
      : undefined;
  const statusRaw = typeof sp.status === "string" ? sp.status : "all";
  const status =
    statusRaw === "available" || statusRaw === "reserved" || statusRaw === "sold"
      ? (statusRaw as GuitarStatus)
      : ("all" as const);
  return { q, category, type, status };
}

export default async function AdminGuitarsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const rows = await listAdminGuitars({
    q: filters.q || undefined,
    category: filters.category,
    type: filters.type,
    status: filters.status,
  });

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Catálogo</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight">Productos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "resultado" : "resultados"} con los filtros actuales.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/guitarras/nueva">
            <Plus className="size-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <form method="get" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Buscar por marca, modelo o slug…"
          className="flex-1 min-w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={filters.status}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponibles</option>
          <option value="reserved">Reservadas</option>
          <option value="sold">Vendidas</option>
        </select>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={filters.type ?? ""}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {guitarTypeLabel(t)}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">
          Filtrar
        </Button>
        {(filters.q || filters.category || filters.type || filters.status !== "all") && (
          <Link href="/admin/guitarras" className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
            Limpiar
          </Link>
        )}
      </form>

      <BulkSelectionProvider>
        <BulkActionsBar allIds={rows.map((g) => g.id)} />

        <div className="rounded-md border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
            <div className="col-span-4">Guitarra</div>
            <div className="col-span-2">Tipo</div>
            <div className="col-span-2">Precio</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-1 text-center">★</div>
            <div className="col-span-1 text-right">Acciones</div>
          </div>
          {rows.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No hay guitarras con esos filtros.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((g) => {
                const hasDiscount =
                  g.status !== "sold" &&
                  typeof g.discount_percent === "number" &&
                  g.discount_percent > 0;
                const discountedPrimary = hasDiscount
                  ? formatPrimaryPrice({
                      usd: applyDiscount(g.price_usd, g.discount_percent),
                      uyu: applyDiscount(g.price_uyu, g.discount_percent),
                    })
                  : null;
                return (
                  <li
                    key={g.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 md:items-center hover:bg-secondary/40 transition-colors"
                  >
                    <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                      <BulkRowCheckbox id={g.id} />
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
                        {g.cover_url ? (
                          <Image
                            src={g.cover_url}
                            alt={`${g.brand} ${g.model}`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/guitarras/${g.id}`}
                          className="block font-medium truncate hover:text-accent transition-colors"
                        >
                          {g.brand} {g.model}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          {g.year ?? "s/a"} · {g.slug}
                        </p>
                        <div className="md:hidden text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                          <span>
                            {typeOrCategoryLabel(g)} ·{" "}
                            {hasDiscount ? (
                              <>
                                <span className="text-accent">{discountedPrimary}</span>{" "}
                                <span className="line-through">
                                  {formatPrimaryPrice({ usd: g.price_usd, uyu: g.price_uyu })}
                                </span>
                              </>
                            ) : (
                              formatPrice({ usd: g.price_usd, uyu: g.price_uyu })
                            )}
                          </span>
                          <RowDiscountButton
                            id={g.id}
                            current={g.discount_percent}
                            guitarLabel={`${g.brand} ${g.model}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
                      {typeOrCategoryLabel(g)}
                    </div>
                    <div className="hidden md:flex md:col-span-2 text-sm flex-col gap-1">
                      {hasDiscount ? (
                        <>
                          <span className="inline-flex items-center gap-2">
                            <span className="text-accent tabular-nums">{discountedPrimary}</span>
                            <RowDiscountButton
                              id={g.id}
                              current={g.discount_percent}
                              guitarLabel={`${g.brand} ${g.model}`}
                            />
                          </span>
                          <span className="text-xs text-muted-foreground line-through tabular-nums">
                            {formatPrimaryPrice({ usd: g.price_usd, uyu: g.price_uyu })}
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-2 flex-wrap">
                          <span>{formatPrice({ usd: g.price_usd, uyu: g.price_uyu })}</span>
                          <RowDiscountButton
                            id={g.id}
                            current={g.discount_percent}
                            guitarLabel={`${g.brand} ${g.model}`}
                          />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 md:gap-0 md:col-span-2">
                      <StatusSelect id={g.id} value={g.status} />
                      <div className="md:hidden flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FeaturedToggle id={g.id} value={g.featured} />
                        Destacada
                      </div>
                    </div>
                    <div className="hidden md:flex md:col-span-1 justify-center">
                      <FeaturedToggle id={g.id} value={g.featured} />
                    </div>
                    <div className="md:col-span-1 flex md:justify-end items-center gap-1">
                      <DuplicateButton id={g.id} />
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/guitarras/${g.id}`}>
                          <Pencil className="size-3.5" />
                          <span className="md:hidden">Editar</span>
                        </Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </BulkSelectionProvider>
    </div>
  );
}
