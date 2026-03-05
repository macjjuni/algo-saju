"use client";

import { useState, useEffect, useRef } from "react";

export default function useScrollDirection(threshold = 10) {
  // region [Hooks]
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) < threshold) return;

      setIsHidden(diff > 0 && currentY > 0);
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  // endregion

  return isHidden;
}
