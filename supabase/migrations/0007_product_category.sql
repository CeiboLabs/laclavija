-- ====================================================================
-- 0007 — Categoria de producto (guitar / amp)
--
-- Hasta ahora la tabla `guitars` solo tenia guitarras. El negocio empezo
-- a vender amplificadores tambien, asi que agregamos un discriminador
-- `category` para poder listarlos en el mismo catalogo con filtro.
--
-- La columna `type` (electric/acoustic/classical/bass) es guitar-especifica:
-- para categoria='amp' no aplica, por eso la hacemos nullable y aflojamos
-- el check.
-- ====================================================================

alter table public.guitars
  add column if not exists category text not null default 'guitar'
  check (category in ('guitar', 'amp'));

alter table public.guitars
  alter column type drop not null;

-- Reescribimos el check de type para admitir null (cuando categoria != guitar).
alter table public.guitars
  drop constraint if exists guitars_type_check;

alter table public.guitars
  add constraint guitars_type_check
  check (type is null or type in ('electric','acoustic','classical','bass'));

-- Guitarras existentes deben tener type; amps no.
alter table public.guitars
  add constraint guitars_category_type_check
  check (
    (category = 'guitar' and type is not null)
    or (category = 'amp' and type is null)
  );

create index if not exists guitars_category_idx on public.guitars(category);
