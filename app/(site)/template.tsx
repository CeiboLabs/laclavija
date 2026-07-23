"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.2, 0.65, 0.3, 0.9] as const;

export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Forzamos smooth-scroll-to-top en cada navegacion de ruta. Sin esto
  // algunos browsers (y Next con scroll: false en algunos Link) dejan la
  // pagina nueva en la misma posicion de scroll, o teletransportan instant.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.scrollY === 0) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
    >
      {children}
    </motion.div>
  );
}
