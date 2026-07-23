import { Search, Sparkles, Wallet } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const steps = [
  {
    icon: Sparkles,
    title: "Selección curada",
    description:
      "Cada guitarra que entra al catálogo pasa por una revisión personal. Si no la pondríamos en nuestra propia colección, no la vendemos.",
  },
  {
    icon: Search,
    title: "Inspección personal",
    description:
      "Probás el instrumento antes de llevarlo. Te contamos todo lo que sabemos: procedencia, mantenimientos, lo bueno y lo no tan bueno.",
  },
  {
    icon: Wallet,
    title: "Pago en el día",
    description:
      "Cuando compramos una guitarra, te ofertamos en 24 horas y pagamos en efectivo en la visita. Sin comisiones ni vueltas.",
  },
];

export function HowWeWork() {
  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-border">
      <Reveal>
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Cómo trabajamos</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">Sin vueltas, cara a cara.</h2>
        </div>
      </Reveal>
      <RevealGroup stagger={0.12} className="grid md:grid-cols-3 gap-12 md:gap-10">
        {steps.map((step, i) => (
          <RevealItem key={step.title}>
            <div className="flex flex-col gap-5 group">
              <div className="flex items-center gap-3">
                <div className="relative size-12 flex items-center justify-center rounded-full border border-accent/50 text-accent transition-all duration-500 group-hover:bg-accent/10 group-hover:scale-105">
                  <step.icon className="size-5" />
                </div>
                <span className="font-serif text-xs uppercase tracking-[0.3em] text-accent/50 tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-serif text-2xl tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
