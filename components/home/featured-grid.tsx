import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuitarCard } from "@/components/catalog/guitar-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { Guitar } from "@/lib/types";

export function FeaturedGrid({ guitars }: { guitars: Guitar[] }) {
  if (guitars.length === 0) return null;

  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Destacadas</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
              En el catálogo esta semana.
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors group"
          >
            Ver todo el catálogo
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <RevealGroup stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {guitars.map((g, i) => (
          <RevealItem key={g.id}>
            <GuitarCard guitar={g} priority={i < 2} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
