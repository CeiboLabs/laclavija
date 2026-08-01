"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { guitarTypeLabel, statusLabel } from "@/lib/format";

const LABELS: Record<string, string> = {
  categoria: "Categoría",
  type: "Tipo",
  brand: "Marca",
  minPrice: "Desde USD",
  maxPrice: "Hasta USD",
  minYear: "Año ≥",
  maxYear: "Año ≤",
  status: "Estado",
  q: "Búsqueda",
};

const CATEGORY_LABELS: Record<string, string> = {
  guitar: "Guitarras",
  amp: "Amplificadores",
  accessory: "Accesorios",
};

function displayValue(key: string, value: string) {
  if (key === "categoria") return CATEGORY_LABELS[value] ?? value;
  if (key === "type") return guitarTypeLabel(value);
  if (key === "status") return statusLabel(value);
  return value;
}

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const chips: Array<{ key: string; value: string }> = [];
  for (const [key, value] of params.entries()) {
    if (LABELS[key] && value) chips.push({ key, value });
  }

  if (chips.length === 0) return null;

  function remove(key: string) {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map(({ key, value }) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => remove(key)}
            layout
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
          >
            <span>
              {LABELS[key]}: <span className="text-foreground">{displayValue(key, value)}</span>
            </span>
            <X className="size-3" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
