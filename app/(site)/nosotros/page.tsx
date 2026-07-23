import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BUSINESS, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Quiénes están detrás de ${BUSINESS.name} — luthier y coleccionista, ${BUSINESS.yearsInBusiness} años comprando y vendiendo guitarras en Montevideo.`,
  alternates: { canonical: "/nosotros" },
};

const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  `${BUSINESS.location.lat},${BUSINESS.location.lng}`,
)}&z=15&output=embed`;

export default function AboutPage() {
  return (
    <article className="pt-16 md:pt-28 pb-24">
      <header className="container-prose px-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Nosotros</p>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl tracking-tight leading-[1.05]">
          Llevamos {BUSINESS.yearsInBusiness} años eligiendo guitarras,
          <span className="italic font-light text-muted-foreground"> una por una.</span>
        </h1>
      </header>

      <Reveal className="my-16 md:my-24 mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src="/decor/headstock-tuning.webp"
            alt="Afinando una guitarra en el taller"
            fill
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center italic">El taller en Pocitos.</p>
      </Reveal>

      <div className="container-prose px-5 sm:px-8 space-y-7 text-foreground/90 leading-relaxed">
        <p>
          Lo que arrancó como una obsesión personal con instrumentos vintage terminó siendo un trabajo.
          Empezamos comprando y vendiendo entre amigos hace más de una década, hasta que el flujo creció lo
          suficiente como para abrir un taller chico en Montevideo donde recibir guitarras, repararlas y armar
          un catálogo curado.
        </p>

        <p>
          No somos una tienda en el sentido tradicional. No tenemos vidriera, no tenemos catálogo masivo, no
          tenemos carrito de compras. Compramos pocas guitarras al mes — sólo las que pasarían nuestro propio
          filtro — y las vendemos a gente que valora lo mismo que nosotros: madera, hardware original, historia.
        </p>
      </div>

      <Reveal className="my-20 md:my-28 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-7 relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
            <Image
              src="/decor/playing-dark.webp"
              alt="Tocando una guitarra acústica"
              fill
              sizes="(min-width: 1024px) 700px, 60vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-5 flex flex-col gap-3 md:gap-4">
            <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
              <Image
                src="/decor/lespaul-playing.webp"
                alt="Detalle de Les Paul en mano"
                fill
                sizes="(min-width: 1024px) 400px, 40vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
              <Image
                src="/decor/classical-hands.webp"
                alt="Manos sobre el diapasón de una clásica"
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
          Cuando compramos: te tasamos justo y te pagamos en el día. Cuando arreglamos: usamos repuestos
          coherentes con la época del instrumento.
        </p>

        <p>
          Si tenés una guitarra para vender o estás buscando algo específico que no aparece en el catálogo,
          escribinos. Mucho de lo bueno entra y sale del taller sin pasar por la web.
        </p>
      </div>

      <Reveal className="mt-20 md:mt-28 max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Visitanos</p>
            <h2 className="mt-4 font-serif text-3xl tracking-tight">Por agenda previa.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              El taller no tiene horario fijo de atención al público. Coordinamos visitas por WhatsApp para que
              estemos disponibles, podamos preparar la guitarra que querés ver y dedicarte el tiempo que merece.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {BUSINESS.city}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <a
                  href={whatsappLink("Hola! Quería coordinar una visita al taller.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Coordinar visita
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/catalogo">
                  Ver catálogo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-secondary">
            <iframe
              src={mapEmbedSrc}
              title="Ubicación del taller en Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      </Reveal>
    </article>
  );
}
