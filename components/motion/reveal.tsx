"use client";

import * as React from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  duration?: number;
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Contenedor que aplica stagger automatico a sus children directos via variants.
 * Usar <RevealItem> adentro para que el efecto se propague.
 */
type RevealGroupProps = Omit<HTMLMotionProps<"div">, "variants"> & {
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
};

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.2,
  once = true,
  ...rest
}: RevealGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = HTMLMotionProps<"div"> & {
  y?: number;
  duration?: number;
};

export function RevealItem({
  children,
  y = 20,
  duration = 0.7,
  className,
  ...rest
}: RevealItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
