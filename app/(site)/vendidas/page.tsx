import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GuitarGrid } from "@/components/catalog/guitar-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalog } from "@/lib/queries";
import { breadcrumbSchema } from "@/lib/seo";

// Dinamico — el histórico depende del stock actual de la DB (guitarras
// que se van vendiendo desde el admin). Con staticAssetsIncrementalCache
// read-only, un SSG no se actualiza; dynamic pega a Supabase en cada request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guitarras vendidas",
  description:
    "Histórico de guitarras vendidas en La Clavija. Si te interesa algo similar al stock pasado, escribinos por WhatsApp.",
  alternates: { canonical: "/vendidas" },
  openGraph: {
    title: "Guitarras vendidas en La Clavija",
    description:
      "Histórico de guitarras que pasaron por La Clavija. Mostramos lo que se vendió para que veas qué tipo de instrumentos movemos.",
    type: "website",
    url: "/vendidas",
  },
  robots: { index: true, follow: true },
};

export default async function VendidasPage() {
  const sold = await getCatalog({ status: "sold" });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Vendidas", path: "/vendidas" },
        ])}
      />
      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-16 md:pt-24 pb-24">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-3" />
          Volver al catálogo
        </Link>

        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Histórico</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">
            Guitarras vendidas.
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Las que ya pasaron por La Clavija. Si te interesa una similar — misma marca, mismo modelo o
            del mismo año — escribinos por WhatsApp y vemos qué tenemos en stock ahora o en camino.
          </p>
        </header>

        {sold.length > 0 ? (
          <GuitarGrid guitars={sold} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-border rounded-2xl">
            <p className="font-serif text-2xl tracking-tight">Sin vendidas todavía</p>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Cuando vendamos algunas, van a aparecer acá.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
