import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { GuitarGrid } from "@/components/catalog/guitar-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalog } from "@/lib/queries";
import { breadcrumbSchema } from "@/lib/seo";
import { TYPE_SLUGS, type TypeSlug } from "@/lib/type-slugs";

type TypeMeta = {
  type: import("@/lib/types").GuitarType;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

const TYPES: Record<TypeSlug, TypeMeta> = {
  electricas: {
    type: "electric",
    h1: "Guitarras eléctricas",
    intro:
      "Stratocaster, Telecaster, Les Paul, SG y más. Eléctricas seleccionadas en Montevideo, revisadas en taller antes de salir al catálogo.",
    metaTitle: "Guitarras eléctricas en Montevideo",
    metaDescription:
      "Catálogo de guitarras eléctricas en Montevideo, Uruguay. Strat, Tele, Les Paul y más, revisadas en taller. Compra, venta y permuta.",
    keywords: [
      "guitarras electricas Montevideo",
      "guitarras electricas Uruguay",
      "comprar Stratocaster",
      "comprar Telecaster",
      "Les Paul usada Uruguay",
    ],
  },
  acusticas: {
    type: "acoustic",
    h1: "Guitarras acústicas",
    intro:
      "Acústicas de cuerda metal en stock. Dreadnought, OM, parlor y más. Revisadas y puestas a punto antes de entrar al catálogo.",
    metaTitle: "Guitarras acústicas en Montevideo",
    metaDescription:
      "Catálogo de guitarras acústicas en Montevideo, Uruguay. Dreadnought, parlor, OM y más, revisadas en taller. Compra, venta y permuta.",
    keywords: [
      "guitarras acusticas Montevideo",
      "guitarras acusticas Uruguay",
      "comprar guitarra acustica",
      "Dreadnought usada",
    ],
  },
  clasicas: {
    type: "classical",
    h1: "Guitarras clásicas",
    intro:
      "Clásicas de cuerda nylon — concierto, estudio, flamencas. Cada una revisada antes de entrar al catálogo.",
    metaTitle: "Guitarras clásicas en Montevideo",
    metaDescription:
      "Catálogo de guitarras clásicas y de concierto en Montevideo, Uruguay. Cuerda nylon, revisadas en taller.",
    keywords: [
      "guitarras clasicas Montevideo",
      "guitarras clasicas Uruguay",
      "guitarra de concierto",
      "guitarra flamenca",
    ],
  },
  bajos: {
    type: "bass",
    h1: "Bajos",
    intro:
      "Bajos eléctricos en stock. Precision, Jazz, modernos y vintage. Revisados y listos para tocar.",
    metaTitle: "Bajos eléctricos en Montevideo",
    metaDescription:
      "Catálogo de bajos eléctricos en Montevideo, Uruguay. Precision, Jazz Bass y más, revisados en taller. Compra, venta y permuta.",
    keywords: [
      "bajos Montevideo",
      "bajos Uruguay",
      "comprar bajo electrico",
      "Precision bass usado",
      "Jazz bass Uruguay",
    ],
  },
};

export function generateStaticParams() {
  return TYPE_SLUGS.map((tipo) => ({ tipo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string }>;
}): Promise<Metadata> {
  const { tipo } = await params;
  const meta = TYPES[tipo as TypeSlug];
  if (!meta) return { title: "Tipo no encontrado" };

  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    keywords: meta.keywords,
    alternates: { canonical: `/tipo/${tipo}` },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      type: "website",
      url: `/tipo/${tipo}`,
    },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  const meta = TYPES[tipo as TypeSlug];
  if (!meta) notFound();

  const [available, reserved] = await Promise.all([
    getCatalog({ type: meta.type, status: "available" }),
    getCatalog({ type: meta.type, status: "reserved" }),
  ]);
  const guitars = [...available, ...reserved];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/catalogo" },
          { name: meta.h1, path: `/tipo/${tipo}` },
        ])}
      />
      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-12 md:pt-16 pb-24">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-3" />
          Volver al catálogo
        </Link>

        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Tipo</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">
            {meta.h1}.
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">{meta.intro}</p>
        </header>

        {guitars.length > 0 ? (
          <GuitarGrid guitars={guitars} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-border rounded-2xl">
            <p className="font-serif text-2xl tracking-tight">
              Sin stock de {meta.h1.toLowerCase()} por ahora
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Entran y salen rápido. Si querés que te avisemos cuando llegue una,{" "}
              <Link href="/vender" className="underline underline-offset-4 hover:text-foreground">
                escribinos
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </>
  );
}

