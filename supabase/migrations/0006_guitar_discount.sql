-- ====================================================================
-- 0006 — Descuento porcentual por guitarra
--
-- guitars.discount_percent: opcional (1-99). NULL = sin descuento.
-- Cuando está seteado, el catálogo muestra badge "−X%" y precio tachado.
-- Se elige guitarra por guitarra desde el admin (también hay bulk).
-- ====================================================================

alter table public.guitars
  add column if not exists discount_percent smallint
    check (discount_percent is null or (discount_percent between 1 and 99));

comment on column public.guitars.discount_percent is
  'Descuento porcentual opcional (1-99). NULL = sin descuento.';
