import type { GuitarType } from "./types";

/** Slugs URL-friendly en español para las paginas /tipo/[tipo]. */
export const TYPE_SLUGS = ["electricas", "acusticas", "clasicas", "bajos"] as const;

export type TypeSlug = (typeof TYPE_SLUGS)[number];

export const SLUG_TO_TYPE: Record<TypeSlug, GuitarType> = {
  electricas: "electric",
  acusticas: "acoustic",
  clasicas: "classical",
  bajos: "bass",
};

export const SLUG_TO_LABEL: Record<TypeSlug, string> = {
  electricas: "Eléctricas",
  acusticas: "Acústicas",
  clasicas: "Clásicas",
  bajos: "Bajos",
};
