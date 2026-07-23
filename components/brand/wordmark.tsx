import { cn } from "@/lib/utils";

interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Si true, "La" va arriba en lugar de a la izquierda */
  stacked?: boolean;
}

const SIZE_LA: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

const SIZE_CLAVIJA: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

/**
 * Wordmark de La Clavija. Replica la jerarquía del logo (La pequeño,
 * Clavija grande) usando tipografía. El logo en imagen vive en
 * `public/brand/la-clavija-logo.png` para usos donde queremos el sello
 * completo con la ilustración del clavijero.
 */
export function Wordmark({ size = "md", className, stacked = false }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-serif tracking-tight leading-none inline-flex",
        stacked ? "flex-col items-start gap-1" : "items-baseline gap-1.5",
        className,
      )}
    >
      <span className={cn("italic font-light opacity-75", SIZE_LA[size])}>La</span>
      <span className={cn("font-medium", SIZE_CLAVIJA[size])}>Clavija</span>
    </span>
  );
}
