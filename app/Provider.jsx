"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import StoreProvider from "../src/store/StoreProvider";
import { useEffect } from "react";

export default function Providers({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.log('SW failed:', err))
    }
  }, [])

  return (
    <StoreProvider>
      <HeroUIProvider>
        {children}
        <Toaster position="top-center" />
      </HeroUIProvider>
    </StoreProvider>
  );
}