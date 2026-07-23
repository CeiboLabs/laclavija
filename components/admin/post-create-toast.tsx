"use client";

import * as React from "react";
import { toast } from "sonner";

export function PostCreateToast({ created }: { created: boolean }) {
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (created) {
      toast.success("Guitarra publicada.");
    }
  }, [created]);

  return null;
}
