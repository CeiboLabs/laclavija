-- ====================================================================
-- 0004 — Año y precios opcionales, precio en UYU
--
-- Cambios:
--   * year: NOT NULL -> NULL (permite "año desconocido")
--   * price_usd: NOT NULL -> NULL (precio en USD ahora opcional)
--   * price_uyu: nueva columna integer NULL (precio en UYU opcional)
--
-- La regla "al menos uno de los dos precios" se valida en la app, no en
-- el schema, para mantener flexibilidad si se quiere admitir guitarras
-- sin precio público (ej: "consultar").
-- ====================================================================

alter table public.guitars
  alter column year drop not null;

alter table public.guitars
  alter column price_usd drop not null;

alter table public.guitars
  add column if not exists price_uyu integer check (price_uyu is null or price_uyu >= 0);
