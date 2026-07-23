-- ====================================================================
-- 0005 — Imagen opcional para el modal de promoción
--
-- promo_config.image_path: path relativo dentro del bucket "guitars"
-- (mismo bucket que las fotos del catálogo) bajo el prefijo "promo/".
-- Cuando se cambia o se borra la promo, la app se encarga de borrar
-- el archivo viejo del storage para no dejarlo huérfano.
-- ====================================================================

alter table public.promo_config
  add column if not exists image_path text;
