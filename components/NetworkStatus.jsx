"use client";

import { useEffect, useState, useRef } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function NetworkStatus() {
  const [status, setStatus] = useState("online");
  const hideTimer = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const strictOnlineRoutes = [
      "/newrequest",
      "/scanner",
      "/details",
      "/upload",
      "/verifydetails",
      "/application-submit",
      "/auth"
    ];

    const enforceStrictOnline = () => {
      const isStrict = strictOnlineRoutes.some(route =>
        window.location.pathname.startsWith(route)
      );
      if (isStrict && window.location.pathname !== "/offline") {
        router.push("/offline");
      }
    };

    const handleOffline = () => {
      clearTimeout(hideTimer.current);
      setStatus("offline");
      enforceStrictOnline();
    };

    const handleOnline = () => {
      setStatus("restored");
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setStatus("online"), 3000);
    };

    if (!navigator.onLine) {
      setStatus("offline");
      enforceStrictOnline();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearTimeout(hideTimer.current);
    };
  }, [pathname, router]);
  

  if (status === "online") return null;
  if (pathname === "/offline") return null;

  const variants = {
    offline: {
      bg: "bg-gray-900",
      text: "text-white",
      icon: <WifiOff size={16} />,
      message: "No internet connection",
      sub: "you are offline app working with limited functionality",
    },
    restored: {
      bg: "bg-emerald-500",
      text: "text-white",
      icon: <Wifi size={16} />,
      message: "Connection restored",
      sub: "You're back online",
    },
  };

  const v = variants[status];
  if (!v) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] ${v.bg} ${v.text} px-4 py-2.5 flex items-center gap-3 shadow-lg`}
      style={{ animation: "slideDown 0.3s ease-out" }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
      <div className="flex-shrink-0">{v.icon}</div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold leading-tight">{v.message}</span>
        <span className="text-xs opacity-80 leading-tight">{v.sub}</span>
      </div>
    </div>
  );
}