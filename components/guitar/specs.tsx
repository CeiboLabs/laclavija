"use client";

import { motion } from "framer-motion";
import type { GuitarSpecs } from "@/lib/types";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

const SPEC_ORDER: Array<{ key: keyof GuitarSpecs; label: string }> = [
  { key: "body_wood", label: "Cuerpo" },
  { key: "neck_wood", label: "Mástil" },
  { key: "fretboard", label: "Diapasón" },
  { key: "pickups", label: "Pickups" },
  { key: "scale_length", label: "Escala" },
  { key: "finish", label: "Acabado" },
  { key: "weight_kg", label: "Peso (kg)" },
  { key: "condition", label: "Estado" },
  { key: "case", label: "Estuche" },
  { key: "serial", label: "Serie" },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} as const;

export function Specs({ specs }: { specs: GuitarSpecs }) {
  const rows = SPEC_ORDER.filter(({ key }) => {
    const v = specs[key];
    return v !== undefined && v !== null && v !== "";
  });

  const accessories = Array.isArray(specs.accessories) ? (specs.accessories as string[]) : [];

  if (rows.length === 0 && accessories.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "-60px" }}
      variants={container}
      className="border-t border-border pt-12"
    >
      <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-accent">
        Especificaciones
      </motion.p>
      <motion.h2 variants={item} className="mt-3 font-serif text-3xl tracking-tight">
        Ficha técnica
      </motion.h2>

      <motion.dl variants={container} className="mt-8 grid sm:grid-cols-2 gap-x-12 gap-y-1">
        {rows.map(({ key, label }) => (
          <motion.div
            key={String(key)}
            variants={item}
            className="flex justify-between gap-4 py-3 border-b border-border/60 text-sm"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right text-foreground/90 max-w-[60%]">{String(specs[key])}</dd>
          </motion.div>
        ))}
      </motion.dl>

      {accessories.length > 0 ? (
        <motion.div variants={item} className="mt-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Incluye</p>
          <ul className="flex flex-wrap gap-2">
            {accessories.map((a) => (
              <li
                key={a}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-foreground/85 transition-colors hover:border-accent/40"
              >
                {a}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
