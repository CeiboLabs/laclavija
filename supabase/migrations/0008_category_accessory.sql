-- ====================================================================
-- 0008 — Nueva categoria: accessory
--
-- Ampliamos el check de `category` para admitir 'accessory' (cables, puas,
-- fundas, cuerdas, etc.), y actualizamos el check combinado para que type
-- pueda ser null tanto para amps como para accesorios (solo las guitarras
-- requieren un type).
-- ====================================================================

alter table public.guitars
  drop constraint if exists guitars_category_check;

alter table public.guitars
  add constraint guitars_category_check
  check (category in ('guitar', 'amp', 'accessory'));

alter table public.guitars
  drop constraint if exists guitars_category_type_check;

alter table public.guitars
  add constraint guitars_category_type_check
  check (
    (category = 'guitar' and type is not null)
    or (category in ('amp', 'accessory') and type is null)
  );
