"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

interface AtmosphereStripProps {
  src: string;
  alt: string;
  quote?: string;
  attribution?: string;
  /** lado donde se alinea la cita sobre la imagen */
  align?: "left" | "right";
  /** alto del strip (clase tailwind) */
  heightClass?: string;
}

export function AtmosphereStrip({
  src,
  alt,
  quote,
  attribution,
  align = "left",
  heightClass = "h-[55vh] md:h-[70vh] min-h-[420px] max-h-[640px]",
}: AtmosphereStripProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });

  return (
    <section ref={sectionRef} className={cn("relative w-full overflow-hidden", heightClass)}>
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30" />
      {align === "left" ? (
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-l from-background/60 via-background/20 to-transparent" />
      )}

      {quote ? (
        <div
          className={cn(
            "relative h-full w-full mx-auto max-w-(--container-2xl) px-5 sm:px-8 flex items-center",
            align === "right" && "justify-end",
          )}
        >
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className={cn("max-w-xl", align === "right" && "text-right")}
          >
            <span aria-hidden className="font-serif text-6xl md:text-7xl leading-none text-accent block">
              &ldquo;
            </span>
            <blockquote className="mt-3 font-serif text-2xl md:text-3xl tracking-tight leading-snug text-foreground">
              {quote}
            </blockquote>
            {attribution ? (
              <figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {attribution}
              </figcaption>
            ) : null}
          </motion.figure>
        </div>
      ) : null}
    </section>
  );
}
