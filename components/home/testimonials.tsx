import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const testimonials = [
  {
    quote:
      "Vendí una Strat del 89 que tenía hace 20 años. Me dieron un precio justo, vinieron al día siguiente, pagaron en efectivo y se fueron en media hora. La transparencia que esperás de gente que sabe.",
    name: "Daniel Pereira",
    role: "Músico — Montevideo",
  },
  {
    quote:
      "Compré una Martin D-28 sin verla en persona — me llegó mejor que en las fotos. Fueron honestos hasta sobre un raspón mínimo en la tapa. Volvería a comprarles sin dudar.",
    name: "Lucía Méndez",
    role: "Profesora de guitarra",
  },
  {
    quote:
      "Necesitaba permutar una eléctrica por una acústica de gama buena. Me ofrecieron tres opciones de su stock, las probé tranquilo, sin presión. Salimos con la Taylor.",
    name: "Federico Rivas",
    role: "Estudiante — Berklee",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-32 border-t border-border">
      <Reveal>
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Lo que dicen</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl tracking-tight">De gente que confió.</h2>
        </div>
      </Reveal>
      <RevealGroup stagger={0.12} className="grid md:grid-cols-3 gap-12 md:gap-10">
        {testimonials.map((t) => (
          <RevealItem key={t.name}>
            <figure className="group flex h-full flex-col gap-6 rounded-md p-6 -m-6 transition-colors duration-500 hover:bg-accent/[0.04]">
              <span
                aria-hidden
                className="font-serif text-6xl leading-none text-accent transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-left group-hover:scale-110"
              >
                &ldquo;
              </span>
              <blockquote className="text-foreground/90 leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-auto pt-5 border-t border-border transition-colors duration-500 group-hover:border-accent/30">
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
