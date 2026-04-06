"use client";

import { useEffect, useState } from "react";

/**
 * SplashScreen
 * ─────────────
 * Shows Logo.png for ~1.5s when the PWA launches,
 * then fades out revealing the app underneath.
 * Only runs when launched as a standalone PWA (from home screen).
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show in standalone mode (installed PWA) or if forced via query
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    // Also show on first visit (sessionStorage flag)
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!isStandalone && alreadyShown) return;

    sessionStorage.setItem("splashShown", "1");
    setVisible(true);

    // Start fade-out after 1.4s
    const fadeTimer = setTimeout(() => setFading(true), 1400);
    // Remove from DOM after fade completes
    const removeTimer = setTimeout(() => setVisible(false), 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        transition: "opacity 0.5s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: "none",
      }}
    >
      {/* Plain img bypasses Next.js optimizer which can't process Logo.png */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logo.png"
        alt="Fusion"
        style={{ width: 220, height: 220, objectFit: "contain" }}
      />
    </div>
  );
}
