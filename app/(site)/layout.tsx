// DEBUG: layout ultra-minimal — sin imports de componentes, sin Supabase.
// Si esto funciona, el crash estaba en un import del layout original
// (Header/Footer/PromoModal/JsonLd/getPromoConfig).

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  console.log("[SiteLayout-DEBUG] rendering minimal");
  return (
    <div style={{ background: "#0A0A0A", color: "#F5F5F5", minHeight: "100vh" }}>
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #333" }}>
        <p style={{ fontSize: "0.75rem", opacity: 0.5 }}>Debug layout</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
