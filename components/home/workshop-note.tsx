import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stamp } from "@/components/decor/stamp";

/**
 * Nota editorial + foto grande. Antes "Del taller" — corregido para reflejar la
 * realidad del negocio: no hay local físico, la selección es personal y las
 * entregas se coordinan en Montevideo.
 */
export function WorkshopNote() {
  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7 relative">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-sm ring-1 ring-border">
              <Image
                src="/decor/home-hero.webp"
                alt="Pared de guitarras eléctricas"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-3 sm:-right-6 hidden sm:block">
              <Stamp variant="workshop" size="lg">
                Selección propia
              </Stamp>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="mono-meta text-accent">Cómo trabajamos</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl tracking-tight leading-tight">
              Pocas guitarras al mes.
              <span className="text-muted-foreground italic font-light"> Solo las que
              pasarían nuestro propio filtro.</span>
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                No somos una tienda tradicional. No hay local, no hay vidriera, no hay
                carrito de compras. Cada instrumento lo revisamos personalmente antes de
                subirlo al catálogo.
              </p>
              <p className="text-foreground/85">
                Coordinamos entrega en Montevideo y hacemos envíos a todo el país por WhatsApp.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-xs">
              <Link
                href="/nosotros"
                className="mono-meta inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors group"
              >
                Sobre nosotros
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {/* Link a Reparaciones desactivado temporalmente. Descomentar cuando se reactive.
              <span aria-hidden className="text-muted-foreground/50">·</span>
              <Link
                href="/reparaciones"
                className="mono-meta inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors group"
              >
                Reparaciones
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              */}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
