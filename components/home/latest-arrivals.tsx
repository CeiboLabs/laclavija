import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stamp } from "@/components/decor/stamp";
import {
  applyDiscount,
  categoryLabel,
  formatPrimaryPrice,
  guitarTypeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Guitar } from "@/lib/types";

/**
 * Grid asimétrico de los últimos 5 productos: uno grande a la izquierda, cuatro
 * chicos a la derecha en 2x2. Alternativa al FeaturedGrid clásico.
 */
export function LatestArrivals({ products }: { products: Guitar[] }) {
  if (products.length === 0) return null;

  const [hero, ...rest] = products;
  if (!hero) return null;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-20 md:py-28">
        <Reveal className="flex items-end justify-between mb-12 gap-6">
          <div>
            <p className="mono-meta text-accent">Últimos en llegar</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
              Recién ingresados
              <span className="text-muted-foreground italic font-light"> al catálogo.</span>
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden sm:inline-flex mono-meta items-center gap-1.5 text-foreground hover:text-accent transition-colors group"
          >
            Ver todo
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Hero card grande */}
          <Reveal>
            <ArrivalCard product={hero} size="lg" />
          </Reveal>
          {/* Grid 2x2 de las 4 restantes */}
          <div className="grid grid-cols-2 gap-6">
            {rest.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={0.1 + i * 0.05}>
                <ArrivalCard product={p} size="sm" />
              </Reveal>
            ))}
          </div>
        </div>

        <Link
          href="/catalogo"
          className="sm:hidden mt-10 mono-meta inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors group"
        >
          Ver todo el catálogo
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function ArrivalCard({ product, size }: { product: Guitar; size: "lg" | "sm" }) {
  const cover = product.images[0];
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const hasDiscount =
    !isSold && typeof product.discount_percent === "number" && product.discount_percent > 0;
  const price = hasDiscount
    ? {
        usd: applyDiscount(product.price_usd, product.discount_percent),
        uyu: applyDiscount(product.price_uyu, product.discount_percent),
      }
    : { usd: product.price_usd, uyu: product.price_uyu };

  const typeLabel =
    product.category === "guitar"
      ? guitarTypeLabel(product.type)
      : categoryLabel(product.category);

  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div
        className={cn(
          "relative overflow-hidden bg-secondary rounded-sm ring-1 ring-border/60",
          size === "lg" ? "aspect-[4/5]" : "aspect-square",
        )}
      >
        {cover ? (
          <Image
            src={cover}
            alt={`${product.brand} ${product.model}`}
            fill
            sizes={size === "lg" ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 22vw, 50vw"}
            className={cn(
              "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]",
              isSold && "opacity-60 grayscale",
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}

        {/* Solo un sello: estado > descuento */}
        {isSold || isReserved ? (
          <div className="absolute right-3 top-3">
            <Stamp variant={isSold ? "sold" : "reserved"} size={size === "lg" ? "md" : "sm"}>
              {isSold ? "Vendida" : "Reservada"}
            </Stamp>
          </div>
        ) : hasDiscount ? (
          <div className="absolute right-3 top-3">
            <Stamp variant="new" size={size === "lg" ? "md" : "sm"}>
              −{product.discount_percent}%
            </Stamp>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="mono-meta text-[0.6rem]">
            {typeLabel}
            {product.year ? ` · ${product.year}` : ""}
          </p>
          <h3
            className={cn(
              "mt-1 font-serif tracking-tight leading-tight group-hover:text-accent transition-colors truncate",
              size === "lg" ? "text-2xl md:text-3xl" : "text-lg",
            )}
          >
            {product.brand} <span className="text-muted-foreground">{product.model}</span>
          </h3>
        </div>
        <p
          className={cn(
            "font-mono tabular-nums shrink-0",
            hasDiscount ? "text-accent" : "text-foreground",
            size === "lg" ? "text-sm" : "text-xs",
          )}
        >
          {formatPrimaryPrice(price)}
        </p>
      </div>
    </Link>
  );
}
