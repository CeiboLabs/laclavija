import { Camera, ClipboardCheck, Handshake } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    icon: Camera,
    title: "Mandanos fotos",
    description:
      "Hacé fotos de la guitarra: frente, dorso, clavijero, traste 12, marcas visibles. Cuanto más detalle, mejor te podemos tasar.",
  },
  {
    icon: ClipboardCheck,
    title: "Oferta en 24 horas",
    description:
      "Revisamos el estado, comparamos con ventas recientes y te mandamos un número firme. Sin compromiso — si no te cierra, lo dejamos ahí.",
  },
  {
    icon: Handshake,
    title: "Coordinamos visita",
    description:
      "Si aceptás la oferta, coordinamos punto de encuentro. Revisamos la guitarra, ajustamos el precio si hace falta, y pagamos en efectivo o transferencia en el momento.",
  },
];

export function ProcessSteps() {
  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-border">
      <div className="max-w-2xl mb-14 md:mb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">El proceso</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">Tres pasos, sin sorpresas.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-12 md:gap-10">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span className="font-serif text-5xl text-accent leading-none">{String(i + 1).padStart(2, "0")}</span>
                <step.icon className="size-5 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl tracking-tight mt-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
