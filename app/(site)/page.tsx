import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  description: BUSINESS.description,
  alternates: { canonical: "/" },
};

// DEBUG: home ultra-minimal — para descartar que el crash esta en Hero/TopMarquee/etc
// Si esto tampoco funciona, el problema esta en layout/middleware/framework
export default function HomePage() {
  console.log("[HomePage-DEBUG] rendering minimal");
  return (
    <div style={{ padding: "4rem 2rem", color: "#F5F5F5" }}>
      <h1 style={{ fontSize: "2rem" }}>Debug home</h1>
      <p>Si ves esto, el layout funciona y el crash estaba en un componente hijo.</p>
    </div>
  );
}
