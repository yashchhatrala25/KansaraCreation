"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking admin page views as customer visits
    if (!pathname || pathname.startsWith("/admin")) return;

    try {
      let sessionId = sessionStorage.getItem("kc_session_id");
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
        sessionStorage.setItem("kc_session_id", sessionId);
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
      const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          sessionId,
          device,
        }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}
