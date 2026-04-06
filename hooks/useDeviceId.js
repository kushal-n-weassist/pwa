"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "device_id";

/**
 * Returns a stable browser fingerprint (visitorId from FingerprintJS).
 * The value is cached in localStorage so it stays consistent across page loads.
 */
export function useDeviceId() {
  const [deviceId, setDeviceId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || null;
    }
    return null;
  });

  useEffect(() => {
    // Already cached — no need to re-generate
    if (deviceId) return;

    let cancelled = false;

    async function generate() {
      try {
        const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const id = result.visitorId;

        if (!cancelled) {
          localStorage.setItem(STORAGE_KEY, id);
          setDeviceId(id);
        }
      } catch (err) {
        // Fallback: use a random UUID stored in localStorage
        if (!cancelled) {
          const fallback =
            crypto.randomUUID?.() ||
            Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem(STORAGE_KEY, fallback);
          setDeviceId(fallback);
        }
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [deviceId]);

  return { deviceId: deviceId || "pending" };
}
