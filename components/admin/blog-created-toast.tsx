"use client";

import * as React from "react";
import { toast } from "sonner";

/** Toast one-shot al llegar con ?created=1 o ?saved=1. */
export function PostCreatedToast({ kind = "created" }: { kind?: "created" | "saved" }) {
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success(kind === "created" ? "Post creado." : "Cambios guardados.");
  }, [kind]);
  return null;
}
