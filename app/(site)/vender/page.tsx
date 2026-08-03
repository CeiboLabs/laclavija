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
      "En efectivo, en el momento, cuando te entregamos la guitarra revisada. También aceptamos transferencia si la preferís.",
  },
  {
    question: "¿Reciben permutas?",
    answer:
      "Sí. Si tenés una guitarra y querés cambiarla por otra del catálogo, tasamos la tuya y ajustamos la diferencia. Es uno de los formatos que más usamos.",
  },
  {
    question: "¿Y si no quiero vendérsela a La Clavija?",
    answer:
      "Te ofrecemos publicarla en nuestro catálogo a cambio de una comisión, que es más baja que la de la mayoría de las tiendas. Vos ponés el precio (o lo definimos juntos), nosotros hacemos las fotos y la descripción, y cobrás cuando se vende. Sirve si estás dispuesto a esperar un poco por un mejor precio.",
  },
  {
    question: "¿Compran guitarras dañadas o sin caso?",
    answer:
      "Sí, depende del estado. Mandanos fotos del daño y te tasamos igual. La revisamos personalmente antes de revender, así que estado original no es deal-breaker.",
  },
  {
    question: "¿Están solo en Montevideo o compran en el interior?",
    answer:
      "Compramos y vendemos en todo el país. En Montevideo coordinamos punto de encuentro; en el interior arreglamos por WhatsApp cómo llega el instrumento (encomienda, transporte, etc.) y ajustamos el precio o el flete según corresponda.",
  },
  {
    question: "¿Compran solo guitarras o también amplis y pedales?",
    answer:
      "Guitarras (eléctricas, acústicas, clásicas y bajos) y amplificadores los compramos por separado. Pedales, solo si vienen en combo con una guitarra o un lote más grande que nos interese.",
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
            <p className="mono-meta text-accent">Vendé tu guitarra</p>
            <h1 className="mt-5 font-serif text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Compramos guitarras
              <br />
              <span className="italic font-light text-muted-foreground">y pagamos en efectivo.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Dos caminos: <span className="text-foreground">te la compramos nosotros</span> (te ofertamos en
              24 horas), o <span className="text-foreground">la publicamos por vos en el catálogo</span> a
              cambio de una comisión, si preferís apuntar a un precio más alto.
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
                alt="Detalle del mástil y cuerdas de una guitarra eléctrica"
                fill
                priority
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-20 md:py-24 border-t border-dashed border-border">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="mono-meta text-accent">Cómo lo hacemos</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
            Dos maneras de vender.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Elegí la que mejor te sirva. En cualquier caso arrancamos con el mismo formulario y despacio
            vemos qué conviene.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <Reveal>
            <div className="h-full rounded-md border border-border p-6 md:p-8 bg-card/40">
              <p className="mono-meta text-accent">Opción 1</p>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight">
                Te la compramos nosotros.
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Nosotros tasamos la guitarra y te hacemos una oferta directa. Si te sirve, coordinamos y
                pagamos en efectivo o transferencia en el momento.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-accent">·</span> Oferta en 24 horas</li>
                <li className="flex gap-2"><span className="text-accent">·</span> Pago inmediato</li>
                <li className="flex gap-2"><span className="text-accent">·</span> Sin esperas, sin intermediarios</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-md border border-dashed border-border p-6 md:p-8 bg-card/40">
              <p className="mono-meta text-accent">Opción 2</p>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight">
                La publicamos por vos.
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Si preferís apuntar a un precio más alto y no tenés apuro, la subimos al catálogo con nuestras
                fotos y descripción a cambio de una <span className="text-foreground">comisión más baja que la
                de la mayoría de las tiendas</span>. Cobrás recién cuando se vende.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-accent">·</span> Aparece en el catálogo curado</li>
                <li className="flex gap-2"><span className="text-accent">·</span> Nosotros hacemos fotos, texto y contacto</li>
                <li className="flex gap-2"><span className="text-accent">·</span> Comisión por debajo del promedio del rubro</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="formulario"
        className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-dashed border-border scroll-mt-24"
      >
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="mono-meta text-accent">Formulario</p>
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
          src="/decor/sell-body.webp"
          alt="Detalle del cuerpo de una guitarra acústica bajo luz cálida"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background" />
      </section>

      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pb-32 pt-24 md:pt-32">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="mono-meta text-accent">Preguntas frecuentes</p>
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
