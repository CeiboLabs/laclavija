"use client";

import { motion } from "framer-motion";
import { GuitarCard } from "./guitar-card";
import type { Guitar } from "@/lib/types";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
} as const;

export function GuitarGrid({ guitars }: { guitars: Guitar[] }) {
  if (guitars.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <p className="font-serif text-2xl tracking-tight">Sin resultados</p>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          Probá quitar algún filtro o cambiá el rango de precio para ver más opciones.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      // Key cambia con la cantidad y los ids del set: cuando el filtro cambia, re-anima.
      key={guitars.map((g) => g.id).join("|")}
      initial="hidden"
      animate="visible"
      variants={container}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
    >
      {guitars.map((g, i) => (
        <motion.div key={g.id} variants={item}>
          <GuitarCard
            guitar={g}
            priority={i < 3}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
