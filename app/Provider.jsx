"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { StoreProvider } from "@/src/store/StoreProvider";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-center"/>
          {children}
  
      </HeroUIProvider>
    </StoreProvider>
  );
}
