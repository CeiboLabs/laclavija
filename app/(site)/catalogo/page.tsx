import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { FilterSheet } from "@/components/catalog/filter-sheet";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { GuitarGrid } from "@/components/catalog/guitar-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { getAllBrands, getCatalog } from "@/lib/queries";
import { countActiveFilters, parseFilters } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Catálogo de guitarras en Montevideo",
  description:
    "Guitarras seleccionadas disponibles en Montevideo, Uruguay. Eléctricas, acústicas, clásicas y bajos. Comprá, vendé o permutá tu instrumento.",
  keywords: [
    "guitarras Montevideo",
    "comprar guitarra Uruguay",
    "guitarras usadas Uruguay",
    "guitarras eléctricas Montevideo",
    "guitarras acústicas Uruguay",
  ],
  alternates: { canonical: "/catalogo" },
};

type Search = Record<string, string | string[] | undefined>;

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  if (!filters.status) filters.status = "available";

  const [guitars, brands] = await Promise.all([getCatalog(filters), getAllBrands()]);
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/catalogo" },
        ])}
      />
      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-16 md:pt-24 pb-24">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-6 mb-6">
            <p className="mono-meta text-accent">Catálogo</p>
            <p className="mono-meta hidden sm:block">
              {guitars.length} {guitars.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
            Guitarras y amps
            <span className="text-muted-foreground italic font-light"> disponibles.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Cada pieza revisada personalmente antes de subir al catálogo. Hacé click para fotos, specs e historia.
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogToolbar />
        </Suspense>

        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <Suspense fallback={<div className="text-xs text-muted-foreground">Cargando filtros…</div>}>
            <ActiveFilters />
          </Suspense>
          <Suspense fallback={null}>
            <FilterSheet brands={brands} activeCount={activeCount} />
          </Suspense>
        </div>

        <div className="flex gap-12">
          <Suspense fallback={null}>
            <FilterSidebar brands={brands} />
          </Suspense>
          <div className="flex-1 min-w-0">
            <GuitarGrid guitars={guitars} />
          </div>
        </div>
      </section>
    </>
  );
}
