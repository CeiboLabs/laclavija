"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
} as const;

export function SellCta() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pb-24 md:pb-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative overflow-hidden rounded-md bg-accent/8 border border-accent/25 px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-24 group/cta"
      >
        <motion.div
          aria-hidden
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute -right-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none transition-transform duration-700 group-hover/cta:scale-110"
        />
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={container}
          className="relative max-w-2xl"
        >
          <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-accent">
            ¿Querés vender?
          </motion.p>
          <motion.h2
            variants={item}
            className="mt-4 font-serif text-4xl md:text-5xl tracking-tight"
          >
            Tasamos tu guitarra en 24 horas.
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl"
          >
            Contanos qué tenés desde el formulario y te respondemos con una oferta firme. Si te
            conviene, coordinamos visita y pagamos en efectivo o transferencia en el día.
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <a href="/vender#formulario">Empezar consulta</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/vender">Ver el proceso completo</a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
