"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/signup/verify-otp",
  "/auth/login/verify-otp",
  "/offline",
];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const isPublic = publicRoutes.some(r => pathname.startsWith(r));

    if (token && !isPublic) return; 
    if (!token && isPublic) return; 

    if (token && isPublic) {
      router.replace("/dashboard");
    } else if (!token && !isPublic) {
      router.replace("/auth/login");
    }
  }, [pathname]);

  return <>{children}</>;
}