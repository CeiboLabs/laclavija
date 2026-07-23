import { PromoForm } from "@/components/admin/promo-form";
import { createServerSupabase } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/supabase/storage";

export default async function AdminPromoPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("promo_config")
    .select("active, title, message, cta_label, cta_url, expires_at, image_path")
    .eq("id", 1)
    .maybeSingle();

  const imagePath = (data?.image_path as string | null) ?? null;
  const initial = {
    active: data?.active ?? false,
    title: (data?.title as string) ?? "",
    message: (data?.message as string) ?? "",
    cta_label: (data?.cta_label as string | null) ?? null,
    cta_url: (data?.cta_url as string | null) ?? null,
    expires_at: (data?.expires_at as string | null) ?? null,
    image_url: imagePath ? publicImageUrl(imagePath) : null,
  };

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Promo modal</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Pop-up del sitio</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        Aparece una vez al día por visitante. Útil para anunciar descuentos, eventos o un nuevo
        ingreso de stock.
      </p>
      <div className="mt-10">
        <PromoForm initial={initial} />
      </div>
    </div>
  );
}
