"use client";

import { useEffect, useState } from "react";

export const compactLayoutQuery = "(max-width: 700px)";

export function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(compactLayoutQuery);
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isCompact;
}
