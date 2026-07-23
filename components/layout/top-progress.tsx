"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Barra fina de progreso indeterminado en el top del viewport. Aparece cuando
 * el visitante hace click en un link interno y se apaga cuando la nueva ruta
 * termino de cargar (pathname/searchParams cambian).
 *
 * No mide progreso real — es solo señal visual de "esta cargando, no se trabo".
 */
export function TopProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Nueva ruta lista -> apagar.
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Click en link interno -> prender.
  useEffect(() => {
    function isExternal(href: string) {
      return /^(https?:|mailto:|tel:)/.test(href);
    }
    function onClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const link = (e.target as HTMLElement | null)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;
      if (isExternal(href)) return;
      setLoading(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden pointer-events-none transition-opacity duration-200",
        loading ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="h-full w-1/3 bg-accent animate-progress-slide" />
    </div>
  );
}
