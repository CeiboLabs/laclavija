import type { Metadata } from "next";
import Image from "next/image";
import {
  Cable,
  Hammer,
  Ruler,
  Settings2,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { RepairForm } from "@/components/repair/repair-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reparación de guitarras en Montevideo",
  description:
    "Reparación, setup y luthería de guitarras en Montevideo. Trastes, electrónica, hardware y reparaciones estructurales. Coordinamos por WhatsApp.",
  keywords: [
    "reparacion de guitarras Montevideo",
    "luthier Montevideo",
    "setup de guitarra Uruguay",
    "fretwork Montevideo",
    "ajuste de guitarra",
    "arreglar guitarra Uruguay",
  ],
  alternates: { canonical: "/reparaciones" },
  openGraph: {
    title: "Reparación de guitarras en Montevideo",
    description:
      "Setup, fretwork, electrónica, hardware y reparaciones estructurales. La Clavija — Montevideo.",
    type: "website",
    url: "/reparaciones",
  },
};

const SERVICES = [
  {
    icon: Ruler,
    title: "Setup completo",
    description:
      "Entonación, octavación, altura de cuerdas y acción puesta a punto para que la guitarra responda como la primera vez. Ideal después del invierno o si hace tiempo que no la tocás.",
  },
  {
    icon: Hammer,
    title: "Trabajo de trastes",
    description:
      "Pulido, nivelación, coronado y refretado completo. Si zumba, trabea o ya tiene huecos profundos, esto lo arregla.",
  },
  {
    icon: Cable,
    title: "Electrónica",
    description:
      "Cambio de pastillas, potes, jacks y switches. Soldaduras prolijas, cableado limpio y diagnóstico de ruidos parásitos.",
  },
  {
    icon: Settings2,
    title: "Hardware",
    description:
      "Clavijas, puentes fijos y trémolos. Calibración de Floyd Rose, cambio de tuners locking, ajuste de bridges Tune-o-matic.",
  },
  {
    icon: Wrench,
    title: "Reparaciones estructurales",
    description:
      "Truss rod trabado, grietas en el cuerpo, levantamiento de puente en acústicas, cabezales rotos (el clásico problema de Gibson).",
  },
  {
    icon: Sparkles,
    title: "Restauración estética",
    description:
      "Retoques de laca, pulido y limpieza profunda. La guitarra no va a parecer nueva, pero sí va a verse cuidada.",
  },
] as const;

const STEPS = [
  {
    title: "Mandanos fotos y contanos qué le pasa",
    description:
      "Llená el formulario o escribinos directo por WhatsApp. Describí el problema o lo que querés mejorar. Fotos de frente, dorso y trastes si podés.",
  },
  {
    title: "Te decimos qué se puede hacer y cuánto sale",
    description:
      "Diagnóstico honesto: qué necesita, qué es opcional, qué no vale la pena. Presupuesto cerrado antes de tocar nada.",
  },
  {
    title: "Coordinamos punto de encuentro",
    description:
      "Acordamos un punto de encuentro en Montevideo para que nos llegue la guitarra. Cuando está lista, hacemos lo mismo para devolvértela.",
  },
];

export default function ReparacionesPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Reparación y luthería de guitarras",
            description:
              "Setup, fretwork, electrónica, hardware y reparaciones estructurales de guitarras eléctricas, acústicas, clásicas y bajos. Servicio en Montevideo, Uruguay.",
            serviceType: "Guitar repair",
            url: "/reparaciones",
            catalog: SERVICES.map((s) => ({ name: s.title, description: s.description })),
          }),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Reparaciones", path: "/reparaciones" },
          ]),
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-16 md:pt-28 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="mono-meta text-accent">Reparaciones</p>
            <h1 className="mt-5 font-serif text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Devolvele la magia
              <br />
              <span className="italic font-light text-muted-foreground">a tu guitarra.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Setup, trastes, electrónica, hardware y reparaciones estructurales. Si zumba, no afina,
              se desafina rápido o directamente algo está roto, lo solucionamos. Diagnóstico honesto y
              presupuesto cerrado antes de empezar.
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
                src="/decor/repair-fretboard.webp"
                alt="Detalle del mástil y trastes de una guitarra eléctrica"
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
        className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-dashed border-border scroll-mt-24"
      >
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="mono-meta text-accent">Consultar</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
              Contanos qué necesita.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Llená estos campos para que la conversación arranque con todo el contexto. Al continuar se
              te abre WhatsApp con el mensaje armado — solo tenés que adjuntar las fotos y enviar.
            </p>
          </div>
          <Reveal className="lg:col-span-7">
            <RepairForm />
          </Reveal>
        </div>
      </section>

      <section
        id="servicios"
        className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-dashed border-border scroll-mt-24"
      >
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="mono-meta text-accent">Servicios</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
            Lo que hacemos.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.05}>
              <div className="flex flex-col gap-4">
                <service.icon className="size-6 text-accent" />
                <h3 className="font-serif text-2xl tracking-tight">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative w-full h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="/decor/repair-amp.webp"
          alt="Amplificador Vox valvular en penumbra"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-(--container-2xl) w-full px-5 sm:px-8">
            <p className="font-serif text-2xl md:text-4xl tracking-tight max-w-2xl">
              &ldquo;Una guitarra bien seteada no se siente como una guitarra arreglada. Se siente como tu
              guitarra otra vez.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— La Clavija</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-border pb-32">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="mono-meta text-accent">El proceso</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">
            Cómo trabajamos.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-10">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="flex flex-col gap-5">
                <span className="font-serif text-5xl text-accent leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl tracking-tight mt-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
