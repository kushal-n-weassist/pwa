"use client";

import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const [checking, setChecking] = useState(false);
  const [dots, setDots] = useState(".");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-redirect when back online
  useEffect(() => {
    const handleOnline = () => {
      router.back();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [router]);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        router.back();
      } else {
        setChecking(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7FF] to-[#F8FAFC] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-[#1DA1FA]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[200px] h-[200px] rounded-full bg-blue-100/50 blur-2xl pointer-events-none" />

      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center border border-blue-100">
          <WifiOff size={52} className="text-[#1DA1FA]" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-[#1DA1FA]/25 animate-ping" />
        <div
          className="absolute inset-[-8px] rounded-full border border-[#1DA1FA]/10"
          style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s" }}
        />
      </div>

      <h1 className="text-[26px] font-extrabold text-gray-900 mb-2 text-center tracking-tight">
        You&apos;re Offline
      </h1>
      <p className="text-[14px] text-gray-500 text-center leading-relaxed mb-10 max-w-[280px]">
        No internet connection detected{dots} Check your Wi-Fi or mobile data and try again.
      </p>

      {/* Tips card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-8 space-y-3">
        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick fixes</p>
        {[
          "Make sure Wi-Fi or mobile data is on",
          "Move closer to your router",
          "Toggle Airplane mode off and on",
        ].map((tip, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#EBF7FF] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1DA1FA] text-[11px] font-bold">{idx + 1}</span>
            </span>
            <span className="text-[13px] text-gray-600 font-medium">{tip}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full max-w-sm gap-3">
        <button
          onClick={handleRetry}
          disabled={checking}
          className="flex items-center justify-center gap-2 bg-[#1DA1FA] text-white font-bold h-14 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-70 text-[15px]"
        >
          <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
          {checking ? "Checking…" : "Try Again"}
        </button>

        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold h-12 rounded-2xl active:scale-95 transition-all text-[14px]"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>

      <p className="mt-8 text-[11px] text-gray-400 text-center">
        This page will redirect automatically when connection is restored.
      </p>
    </div>
  );
}
