import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProcessSteps } from "@/components/sell/process-steps";
import { SellForm } from "@/components/sell/sell-form";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo";

const FAQS = [
  {
    question: "¿Cuánto tardan en tasarme la guitarra?",
    answer:
      "En menos de 24 horas. Nos mandás fotos y datos por el formulario (te abre WhatsApp con el mensaje listo) y te pasamos una oferta concreta. Si te interesa, coordinamos visita para verla en persona.",
  },
  {
    question: "¿Cómo pagan?",
    answer:
      "En efectivo, en el momento, cuando te entregamos la guitarra revisada. También aceptamos transferencia si la preferís. Sin esperas y sin comisiones.",
  },
  {
    question: "¿Reciben permutas?",
    answer:
      "Sí. Si tenés una guitarra y querés cambiarla por otra del catálogo, tasamos la tuya y ajustamos la diferencia. Es uno de los formatos que más usamos.",
  },
  {
    question: "¿Compran guitarras dañadas o sin caso?",
    answer:
      "Sí, depende del estado. Mandanos fotos del daño y te tasamos igual. Restauramos en taller antes de revender, así que estado original no es deal-breaker.",
  },
  {
    question: "¿Tengo que ir a algún lado para que la vean?",
    answer:
      "No, coordinamos nosotros. Cuando hay interés mutuo después del intercambio inicial, acordamos un punto de encuentro en Montevideo para verla en persona.",
  },
  {
    question: "¿Compran solo guitarras o también amplis y pedales?",
    answer:
      "Nos enfocamos en guitarras (eléctricas, acústicas, clásicas y bajos). Amplis y pedales solo si vienen en lote con una guitarra que nos interese.",
  },
];

export const metadata: Metadata = {
  title: "Vendé tu guitarra en Montevideo",
  description:
    "Tasamos tu guitarra en 24 horas y pagamos en efectivo. Compra y permuta de guitarras usadas en Montevideo, Uruguay.",
  keywords: [
    "vender guitarra Montevideo",
    "vender guitarra Uruguay",
    "tasar guitarra usada",
    "permuta de guitarras",
  ],
  alternates: { canonical: "/vender" },
};

export default function SellPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-16 md:pt-28 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Vendé tu guitarra</p>
            <h1 className="mt-5 font-serif text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Compramos guitarras
              <br />
              <span className="italic font-light text-muted-foreground">y pagamos en efectivo.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Si tenés una guitarra que querés vender, dale. Sin comisiones, sin esperar a que alguien la
              compre. Te ofertamos en 24 horas y, si te conviene, coordinamos visita y pagamos en efectivo o
              transferencia en el momento.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="accent">
                <a href="#formulario">Empezar consulta</a>
              </Button>
            </div>
          </div>
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-secondary">
              <Image
                src="/decor/sell-fretboard.webp"
                alt="Detalle del mástil y los trastes de una guitarra"
                fill
                priority
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="formulario"
        className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-border scroll-mt-24"
      >
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Formulario</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
              Contanos qué tenés.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Llená estos campos para que la conversación arranque con todo el contexto. Al continuar se
              te abre WhatsApp con el mensaje armado — solo tenés que adjuntar las fotos y enviar.
            </p>
          </div>
          <Reveal className="lg:col-span-7">
            <SellForm />
          </Reveal>
        </div>
      </section>

      <ProcessSteps />

      <section className="relative w-full h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="/decor/electric-pickup.webp"
          alt="Detalle de cuerdas y pastillas de una guitarra eléctrica"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background" />
      </section>

      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pb-32 pt-24 md:pt-32">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Preguntas frecuentes</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
              Lo que nos preguntan seguido.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-border border-y border-border">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group py-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-serif text-lg md:text-xl tracking-tight">
                    <span>{faq.question}</span>
                    <span className="ml-4 text-accent text-2xl leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
