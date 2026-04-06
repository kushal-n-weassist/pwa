"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import StoreProvider from "../src/store/StoreProvider";
import { useEffect } from "react";

export default function Providers({ children }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'development') {
      // In dev, next-pwa is disabled — unregister any stale SW from a previous
      // production build so it doesn't intercept HMR / manifest requests.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          reg.unregister();
          console.log('[SW] Unregistered stale SW in dev:', reg.scope);
        });
      });
      return;
    }

    // Production: stash beforeinstallprompt early so InstallPrompt never misses it
    const earlyHandler = (e) => {
      e.preventDefault();
      window.__installPromptEvent = e;
      window.dispatchEvent(new CustomEvent('installpromptready'));
    };
    window.addEventListener('beforeinstallprompt', earlyHandler);

    // next-pwa auto-registers its generated sw.js on build; this is a safety fallback
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.log('SW failed:', err));

    return () => window.removeEventListener('beforeinstallprompt', earlyHandler);
  }, []);

  return (
    <StoreProvider>
      <HeroUIProvider>
        {children}
        <Toaster position="top-center" />
      </HeroUIProvider>
    </StoreProvider>
  );
}