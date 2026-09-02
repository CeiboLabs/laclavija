"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  const path = pathname ?? "";

  // Ocultar en paginas de intake — el form es el unico path.
  const isIntake = path.startsWith("/vender") || path.startsWith("/reparaciones");
  if (isIntake) return null;

  // En detalle de guitarra mobile ya existe StickyWhatsAppCta abajo —
  // ocultamos el flotante ahi para no duplicar CTA.
  const isGuitarDetail = /^\/catalogo\/[^/]+$/.test(path);
  const hideOnMobile = isGuitarDetail;

  return (
    <AnimatePresence>
      <motion.div
        key="floating-wa"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.6 }}
        className={`fixed z-40 bottom-6 right-6 ${hideOnMobile ? "hidden lg:block" : ""}`}
      >
        <a
          href={whatsappLink("Hola, entré a la web de La Clavija y quería consultar.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          className="group inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full border border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-lg shadow-black/20 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
        >
          <span className="relative inline-flex">
            <MessageCircle className="size-4" />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-accent/60 animate-soft-ping pointer-events-none"
            />
          </span>
          WhatsApp
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
