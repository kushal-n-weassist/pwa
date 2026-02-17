"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import StoreProvider from "../src/store/StoreProvider";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <HeroUIProvider>
        {children}
        <Toaster position="top-center" />
      </HeroUIProvider>
    </StoreProvider>
  );
}