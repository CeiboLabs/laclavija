"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export type ChangePasswordState = { ok: boolean; error?: string };

export async function changePasswordAction(
  _prev: ChangePasswordState | null,
  formData: FormData,
): Promise<ChangePasswordState> {
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (!current) return { ok: false, error: "Ingresá tu contraseña actual." };
  if (!next) return { ok: false, error: "Ingresá la contraseña nueva." };
  if (next.length < 8) return { ok: false, error: "La contraseña nueva debe tener al menos 8 caracteres." };
  if (next !== confirm) return { ok: false, error: "Las contraseñas nuevas no coinciden." };
  if (next === current) return { ok: false, error: "La contraseña nueva tiene que ser distinta a la actual." };

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: "Sesión no válida." };

  // Re-autenticamos con la contraseña actual antes de cambiarla, para evitar
  // que alguien que agarra una sesión abierta pueda cambiar el password sin saberlo.
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (signInErr) return { ok: false, error: "La contraseña actual no es correcta." };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
