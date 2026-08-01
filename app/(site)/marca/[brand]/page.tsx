import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { GuitarGrid } from "@/components/catalog/guitar-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllBrands, getCatalog } from "@/lib/queries";
import { brandToSlug, slugToBrand } from "@/lib/brand-slug";
import { breadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((brand) => ({ brand: brandToSlug(brand) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brands = await getAllBrands();
  const brand = slugToBrand(brandSlug, brands);
  if (!brand) return { title: "Marca no encontrada" };

  const title = `Guitarras ${brand} en Montevideo`;
  const description = `Guitarras ${brand} en stock en La Clavija. Compra, venta y permuta de ${brand} en Montevideo, Uruguay. Instrumentos seleccionados y revisados personalmente.`;

  return {
    title,
    description,
    keywords: [
      `${brand} Uruguay`,
      `${brand} Montevideo`,
      `comprar ${brand}`,
      `vender ${brand}`,
      `${brand} usada`,
    ],
    alternates: { canonical: `/marca/${brandSlug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/marca/${brandSlug}`,
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  const brands = await getAllBrands();
  const brand = slugToBrand(brandSlug, brands);
  if (!brand) notFound();

  const [available, reserved] = await Promise.all([
    getCatalog({ brand, status: "available" }),
    getCatalog({ brand, status: "reserved" }),
  ]);
  const guitars = [...available, ...reserved];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/catalogo" },
          { name: brand, path: `/marca/${brandSlug}` },
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
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Marca</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight">
            Guitarras {brand}.
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            La selección de {brand} en stock en La Clavija. Compra, venta y permuta en
            Montevideo, Uruguay. Cada instrumento fue revisado personalmente —
            consultá por WhatsApp o coordiná visita.
          </p>
        </header>

        {guitars.length > 0 ? (
          <GuitarGrid guitars={guitars} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-border rounded-2xl">
            <p className="font-serif text-2xl tracking-tight">
              Sin stock de {brand} por ahora
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Las {brand} entran y salen rápido. Si querés que te avisemos cuando llegue una,{" "}
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
