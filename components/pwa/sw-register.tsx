"use client";

import { useEffect } from "react";

export default function SwRegister() {
  // region [Life Cycles]
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
    }
  }, []);
  // endregion

  return null;
}
