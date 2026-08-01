import { cn } from "@/lib/utils";

/**
 * Marquee horizontal infinito estilo "portal" — cuando el contenido sale por un lado,
 * ya está apareciendo por el otro, sin salto ni pausa. Duplica children internamente
 * y anima la track completa un 50% para que el loop cuadre exacto.
 *
 * Clave: el `pr-(--gap)` en cada copia genera el gap entre la última entrada de una
 * copia y la primera de la siguiente, para que el ritmo del loop sea perfecto.
 */
export function Marquee({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "group relative overflow-hidden whitespace-nowrap [--gap:2rem] py-3",
        className,
      )}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center gap-(--gap) pr-(--gap)">
          {children}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center gap-(--gap) pr-(--gap)"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
