import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GuitarCard } from "@/components/catalog/guitar-card";
import type { Guitar } from "@/lib/types";

/**
 * Grid simple de últimos 3 productos ingresados. Usa la misma GuitarCard del
 * catálogo para consistencia visual y tamaño moderado.
 */
export function LatestArrivals({ products }: { products: Guitar[] }) {
  if (products.length === 0) return null;
  const items = products.slice(0, 3);

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

        <RevealGroup
          stagger={0.08}
          className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((product) => (
            <RevealItem key={product.id}>
              <GuitarCard
                guitar={product}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
            </RevealItem>
          ))}
        </RevealGroup>

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
