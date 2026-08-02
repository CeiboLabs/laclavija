import { cn } from "@/lib/utils";

/**
 * Marquee horizontal infinito estilo "portal" — cuando el contenido sale por un lado,
 * ya está apareciendo por el otro, sin salto ni pausa.
 *
 * Cómo funciona:
 *  - Duplicamos los children en dos "tracks" idénticos, uno al lado del otro.
 *  - La animación mueve el contenedor exterior de `translateX(0)` a `translateX(-50%)`.
 *  - Cuando la animación reinicia (vuelve a 0), lo que se ve en pantalla es el
 *    inicio del track 2 (que es idéntico al track 1), así que el ciclo se ve continuo.
 *  - El `mr-8` al final de cada track suma el "gap entre el último item y el primero
 *    del siguiente ciclo" que le da ritmo constante.
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
      className={cn("group relative overflow-hidden whitespace-nowrap py-3", className)}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center gap-8 mr-8">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-8 mr-8">
          {children}
        </div>
      </div>
    </div>
  );
}
