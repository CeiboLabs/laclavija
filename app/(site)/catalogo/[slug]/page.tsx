import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Gallery } from "@/components/guitar/gallery";
import { Specs } from "@/components/guitar/specs";
import { WhatsAppCta, StickyWhatsAppCta } from "@/components/guitar/whatsapp-cta";
import { ShareButton } from "@/components/guitar/share-button";
import { Similar } from "@/components/guitar/similar";
import { ViewTracker } from "@/components/tracking/view-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllSlugs, getGuitarBySlug, getSimilarGuitars } from "@/lib/queries";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { brandToSlug } from "@/lib/brand-slug";
import { applyDiscount, formatPrice, formatPrimaryPrice, formatSecondaryPrice, guitarTypeLabel, statusLabel } from "@/lib/format";

export async function generateStaticParams() {
  return await getAllSlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guitar = await getGuitarBySlug(slug);
  if (!guitar) return { title: "Guitarra no encontrada" };

  const title = guitar.year
    ? `${guitar.brand} ${guitar.model} ${guitar.year}`
    : `${guitar.brand} ${guitar.model}`;
  const priceLabel = formatPrice({ usd: guitar.price_usd, uyu: guitar.price_uyu });
  const description = guitar.short_description || `${title} — ${priceLabel}`;
  return {
    title,
    description,
    alternates: { canonical: `/catalogo/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/catalogo/${slug}`,
    },
  };
}

export default async function GuitarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guitar = await getGuitarBySlug(slug);
  if (!guitar) notFound();

  const similar = await getSimilarGuitars(guitar, 3);
  const isAvailable = guitar.status === "available";
  const alt = guitar.year
    ? `${guitar.brand} ${guitar.model} ${guitar.year}`
    : `${guitar.brand} ${guitar.model}`;

  return (
    <>
      <JsonLd
        data={[
          productSchema(guitar),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            { name: alt, path: `/catalogo/${guitar.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-8 md:pt-12 pb-32 lg:pb-24">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-3" />
          Volver al catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <Gallery images={guitar.images} alt={alt} />

          <div className="lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              {guitar.year ? `${guitarTypeLabel(guitar.type)} · ${guitar.year}` : guitarTypeLabel(guitar.type)}
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight leading-[1.05]">
              <Link
                href={`/marca/${brandToSlug(guitar.brand)}`}
                className="hover:text-accent transition-colors"
              >
                {guitar.brand}
              </Link>
              <br />
              <span className="text-muted-foreground font-light italic">{guitar.model}</span>
            </h1>

            {(() => {
              const discount = guitar.discount_percent;
              const hasDiscount =
                guitar.status !== "sold" && typeof discount === "number" && discount > 0;
              const discounted = hasDiscount
                ? { usd: applyDiscount(guitar.price_usd, discount), uyu: applyDiscount(guitar.price_uyu, discount) }
                : { usd: guitar.price_usd, uyu: guitar.price_uyu };
              const primary = formatPrimaryPrice(discounted);
              const secondary = formatSecondaryPrice(discounted);
              const originalPrimary = hasDiscount
                ? formatPrimaryPrice({ usd: guitar.price_usd, uyu: guitar.price_uyu })
                : null;

              return (
                <div className="mt-6 flex items-baseline gap-4 flex-wrap">
                  <div>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <p className="font-serif text-3xl tracking-tight tabular-nums">{primary}</p>
                      {hasDiscount ? (
                        <Badge variant="accent" className="font-bold tabular-nums">
                          −{discount}%
                        </Badge>
                      ) : null}
                    </div>
                    {originalPrimary ? (
                      <p className="mt-1 text-sm text-muted-foreground line-through tabular-nums">
                        antes {originalPrimary}
                      </p>
                    ) : null}
                    {secondary ? (
                      <p className="mt-1 text-sm text-muted-foreground">aprox. {secondary}</p>
                    ) : null}
                  </div>
                  {!isAvailable ? (
                    <Badge variant={guitar.status === "sold" ? "sold" : "reserved"}>
                      {statusLabel(guitar.status)}
                    </Badge>
                  ) : null}
                </div>
              );
            })()}

            {guitar.short_description ? (
              <p className="mt-6 text-lg text-foreground/85 leading-relaxed">{guitar.short_description}</p>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <WhatsAppCta guitar={guitar} />
              <ShareButton guitar={guitar} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              También podés coordinar un encuentro para verla en persona.
            </p>
          </div>
        </div>

        {guitar.long_description ? (
          <section className="mt-20 md:mt-28 border-t border-border pt-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">La historia</p>
            <div className="mt-6 max-w-2xl">
              {guitar.long_description.split("\n\n").map((p, i) => (
                <p key={i} className="text-foreground/90 leading-relaxed mb-5 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-20 md:mt-28">
          <Specs specs={guitar.specs} />
        </div>

        <div className="mt-20 md:mt-28">
          <Similar guitars={similar} type={guitar.type} />
        </div>
      </article>

      <StickyWhatsAppCta guitar={guitar} />
      <ViewTracker guitarId={guitar.id} />
    </>
  );
}
