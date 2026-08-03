import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BUSINESS, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Quiénes están detrás de ${BUSINESS.name} — coleccionista y curador de guitarras en Montevideo, Uruguay.`,
  alternates: { canonical: "/nosotros" },
};

export default function AboutPage() {
  return (
    <article className="pt-16 md:pt-28 pb-24">
      <header className="container-prose px-5 sm:px-8">
        <p className="mono-meta text-accent">Nosotros</p>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl tracking-tight leading-[1.05]">
          Elegimos guitarras
          <span className="italic font-light text-muted-foreground"> una por una.</span>
        </h1>
      </header>

      <Reveal className="my-16 md:my-24 mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src="/decor/about-workshop.webp"
            alt="Pared con guitarras acústicas colgadas"
            fill
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center italic">
          Guitarras que buscan segundos sonidos.
        </p>
      </Reveal>

      <div className="container-prose px-5 sm:px-8 space-y-7 text-foreground/90 leading-relaxed">
        <p>
          Lo que arrancó como una obsesión personal con guitarras terminó siendo un trabajo. Empezamos
          comprando y vendiendo entre amigos, y con el tiempo se convirtió en una selección chica pero
          cuidada de guitarras usadas.
        </p>

        <p>
          No somos una tienda en el sentido tradicional. No hay local, no hay vidriera, no hay catálogo
          masivo, no hay carrito de compras. Compramos pocas guitarras al mes — solo las que pasarían nuestro
          propio filtro — y las vendemos a gente que valora lo mismo que nosotros: madera, sonido, historia.
        </p>
      </div>

      <Reveal className="my-20 md:my-28 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-7 relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
            <Image
              src="/decor/about-martin.webp"
              alt="Interior de una Martin D-28 con etiqueta original"
              fill
              sizes="(min-width: 1024px) 700px, 60vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-5 flex flex-col gap-3 md:gap-4">
            <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
              <Image
                src="/decor/about-amps.webp"
                alt="Cabezales de amplificadores Marshall y Fender vintage"
                fill
                sizes="(min-width: 1024px) 400px, 40vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
              <Image
                src="/decor/about-acoustic.webp"
                alt="Detalle del cuerpo de una acústica vintage"
                fill
                sizes="(min-width: 1024px) 400px, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="container-prose px-5 sm:px-8 space-y-7 text-foreground/90 leading-relaxed">
        <p>
          La filosofía es simple. Cuando vendemos: te contamos todo lo que sabemos, lo bueno y lo no tan bueno.
          Cuando compramos: te tasamos justo y te pagamos al recibir la guitarra.
        </p>

        <p>
          Si tenés una guitarra para vender o estás buscando algo específico que no aparece en el catálogo,
          escribinos. Mucho de lo bueno se mueve sin pasar por la web.
        </p>
      </div>

      <Reveal className="mt-20 md:mt-28 max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <p className="mono-meta text-accent">Coordinar encuentro</p>
        <h2 className="mt-4 font-serif text-3xl tracking-tight">Todo por WhatsApp.</h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          No tenemos local abierto al público. Coordinamos las entregas por WhatsApp para que puedas probar
          la guitarra que te interesa con tiempo y sin apuro.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Si estás en el interior, <span className="text-foreground">hacemos envíos a todo el país</span> —
          coordinamos por WhatsApp según el instrumento y la zona.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          {BUSINESS.city}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild variant="accent">
            <a
              href={whatsappLink("Hola! Quería coordinar un encuentro para ver una guitarra.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Coordinar encuentro
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalogo">
              Ver catálogo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </article>
  );
}
