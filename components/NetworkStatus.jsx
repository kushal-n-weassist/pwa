"use client";

import { useEffect, useState, useRef } from "react";
import { WifiOff, Wifi, AlertTriangle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function NetworkStatus() {
  const [status, setStatus] = useState("online");
  const hideTimer = useRef(null);
  const pingTimer = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const pingServer = async () => {
    if (!navigator.onLine) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const start = Date.now();
      await fetch("/favicon.ico?_=" + Date.now(), {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const duration = Date.now() - start;
      if (duration > 3000) {
        setStatus("slow");
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setStatus("online"), 5000);
      } else if (status === "slow") {
        setStatus("online");
      }
    } catch {
      if (navigator.onLine) {
        setStatus("slow");
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setStatus("online"), 5000);
      }
    }
  };

  useEffect(() => {
    // Strict routes that absolutely depend on network API
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
      const isStrict = strictOnlineRoutes.some(route => window.location.pathname.startsWith(route));
      if (isStrict && window.location.pathname !== "/offline") {
        router.push("/offline");
      }
    };

    const handleOffline = () => {
      clearTimeout(hideTimer.current);
      clearInterval(pingTimer.current);
      setStatus("offline");
      // Redirect to /offline ONLY if they are on a strictly online route
      enforceStrictOnline();
    };

    const handleOnline = () => {
      setStatus("restored");
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setStatus("online"), 3000);
      pingTimer.current = setInterval(pingServer, 30000);
    };

    // If already offline on mount, check if we need to boot them from a strict route
    if (!navigator.onLine && status !== "offline") {
      setStatus("offline");
      enforceStrictOnline();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    pingTimer.current = setInterval(pingServer, 30000);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearTimeout(hideTimer.current);
      clearInterval(pingTimer.current);
    };
  }, [pathname, status, router]);

  if (status === "online") return null;

  // On /offline page, don't render the banner (page itself is the fallback)
  if (pathname === "/offline") return null;

  const variants = {
    offline: {
      bg: "bg-gray-900",
      text: "text-white",
      icon: <WifiOff size={16} />,
      message: "No internet connection",
      sub: "Redirecting to offline page…",
    },
    slow: {
      bg: "bg-amber-500",
      text: "text-white",
      icon: <AlertTriangle size={16} />,
      message: "Slow connection detected",
      sub: "Please connect to a better network",
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
      {status === "slow" && (
        <button
          onClick={() => window.location.reload()}
          className="ml-auto flex-shrink-0 text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 font-medium transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
