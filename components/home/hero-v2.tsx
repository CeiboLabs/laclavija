"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
} as const;

/**
 * Hero de la home con banner de fondo (home-hero.webp) + tipografía en primer plano.
 * Diseño clásico foto-full + overlay de texto, sin depender del catálogo.
 */
export function HeroV2() {
  return (
    <section className="relative -mt-16 h-dvh min-h-[640px] w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src="/decor/home-hero.webp"
          alt="Guitarras de La Clavija"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Top vignette para legibilidad del header */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" />
      {/* Bottom gradient para fundir con el resto del sitio */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/0" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative h-full w-full mx-auto max-w-(--container-2xl) flex flex-col justify-end px-5 sm:px-8 pb-16 md:pb-24"
      >
        <motion.p variants={itemVariants} className="mono-meta text-accent">
          Montevideo, Uruguay
        </motion.p>
        <h1 className="mt-5 font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight max-w-4xl leading-[1.02]">
          <span className="block">Guitarras seleccionadas.</span>
          <span className="block italic font-light text-muted-foreground">
            Compra, venta y permuta.
          </span>
        </h1>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/catalogo" className="group">
              Ver catálogo
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/vender">Vendé tu guitarra</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
