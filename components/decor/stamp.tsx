import { cn } from "@/lib/utils";

/**
 * "Sello" estilo tampón — texto rotado, borde grueso, look de goma.
 * Reemplaza a los badges de estado (Vendida/Reservada/Recién llegada) y sirve
 * como marcador visual editorial en el sitio.
 *
 * Variants:
 *  - sold: rojo/óxido tachante, rotación fuerte
 *  - reserved: ámbar, rotación media
 *  - new: dorado (accent), rotación leve
 *  - repair: gris, rotación leve
 */
type StampVariant = "sold" | "reserved" | "new" | "repair" | "workshop";

const STYLES: Record<StampVariant, { color: string; rotate: string }> = {
  sold: { color: "text-destructive border-destructive/80", rotate: "-rotate-12" },
  reserved: { color: "text-amber-500 border-amber-500/70", rotate: "-rotate-6" },
  new: { color: "text-accent border-accent/70", rotate: "-rotate-3" },
  repair: { color: "text-muted-foreground border-muted-foreground/60", rotate: "rotate-2" },
  workshop: { color: "text-foreground border-foreground/60", rotate: "-rotate-2" },
};

export function Stamp({
  children,
  variant = "new",
  className,
  size = "md",
}: {
  children: React.ReactNode;
  variant?: StampVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const style = STYLES[variant];
  const sizeCls =
    size === "sm"
      ? "text-[0.6rem] px-2 py-0.5 border-2"
      : size === "lg"
        ? "text-sm px-4 py-1.5 border-[3px]"
        : "text-xs px-3 py-1 border-2";

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase tracking-[0.18em] font-bold rounded-sm bg-transparent",
        "select-none",
        style.color,
        style.rotate,
        sizeCls,
        className,
      )}
    >
      {children}
    </span>
  );
}
