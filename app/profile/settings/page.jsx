"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Trash2,
  RefreshCw,
  Database,
  Info,
  HardDrive,
  Shield,
  Zap,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/login/store/loginSlice";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [clearing, setClearing] = useState(null);

  const handleClearCache = async () => {
    setClearing("cache");
    try {
      // 1. Wipe all Cache Storage (Workbox pages, assets, images)
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      
      // 2. Unregister Service Workers to ensure fresh fetch
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }

      toast.success("Cache cleared! Reloading...", { duration: 1500 });
      
      // 3. Force hard reload from server
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      toast.error("Failed to clear cache");
      setClearing(null);
    }
  };

  const handleClearData = async () => {
    setClearing("data");
    try {
      const preserve = ["persist:root"];
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!preserve.includes(k)) keysToDelete.push(k);
      }
      keysToDelete.forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
      dispatch(logout()); // Log user out
      toast.success("App data cleared!");
      setTimeout(() => router.push("/auth/login"), 500);
    } catch {
      toast.error("Failed to clear app data");
    } finally {
      setClearing(null);
    }
  };

  const handleClearAll = async () => {
    setClearing("all");
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }

      sessionStorage.clear();
      dispatch(logout());
      toast.success("Everything cleared! Reloading...", { duration: 1500 });
      setTimeout(() => {
        router.push("/auth/login");
        setTimeout(() => window.location.reload(), 200);
      }, 1200);
    } catch {
      toast.error("Something went wrong");
      setClearing(null);
    }
  };

  const storageActions = [
    {
      id: "cache",
      label: "Clear Cache",
      description: "Remove cached pages & assets",
      icon: Trash2,
      color: "text-blue-500",
      bg: "bg-blue-50",
      action: handleClearCache,
      confirmLabel: "Clearing…",
      danger: false,
    },
    {
      id: "data",
      label: "Clear App Data",
      description: "Remove app data & log out",
      icon: Database,
      color: "text-violet-500",
      bg: "bg-violet-50",
      action: handleClearData,
      confirmLabel: "Clearing…",
      danger: false,
    },
    {
      id: "all",
      label: "Clear & Reload",
      description: "Full reset — clears everything",
      icon: RefreshCw,
      color: "text-rose-500",
      bg: "bg-rose-50",
      action: handleClearAll,
      confirmLabel: "Reloading…",
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1DA1FA] to-[#0d7fd8] px-6 pt-12 pb-24 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute top-16 -right-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-white/8" />

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-all"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-[20px] font-extrabold text-white tracking-tight">Settings</h1>
            <p className="text-white/70 text-[12px] font-medium">App preferences & storage</p>
          </div>
        </div>
      </div>

      {/* Main content — overlaps header */}
      <div className="flex-grow -mt-14 rounded-t-[36px] bg-[#F0F4F8] px-5 pt-6 pb-10 relative z-10 flex flex-col gap-5">

        {/* Storage & Cache section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <HardDrive size={13} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Storage & Cache</span>
          </div>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {storageActions.map((item) => {
              const Icon = item.icon;
              const isLoading = clearing === item.id;
              const isDisabled = clearing !== null;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  disabled={isDisabled}
                  className="flex items-center gap-4 w-full px-5 py-4 active:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                >
                  <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon
                      size={20}
                      className={`${item.color} ${isLoading ? "animate-spin" : ""}`}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold ${item.danger ? "text-rose-500" : "text-gray-800"}`}>
                      {isLoading ? item.confirmLabel : item.label}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5 font-medium">{item.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* App Info section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Smartphone size={13} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">About</span>
          </div>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {[
              { label: "App Name", value: "WeAssist" },
              { label: "Version", value: "0.1.0" },
              { label: "Build Type", value: "PWA (Progressive Web App)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-4">
                <p className="text-[13px] font-medium text-gray-500">{label}</p>
                <p className="text-[13px] font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 flex gap-4 items-start border border-blue-100">
          <div className="w-9 h-9 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-[#1DA1FA]" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-700 mb-1">About Caching</p>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              WeAssist caches pages and assets so the app loads instantly and works offline.
              If you notice stale content, clearing the cache forces a fresh download.
            </p>
          </div>
        </div>

        {/* Shield / Privacy note */}
        <div className="flex items-center gap-3 px-2">
          <Shield size={14} className="text-gray-300 flex-shrink-0" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Clearing cache or data does not log you out. Your account and session remain intact.
          </p>
        </div>
      </div>
    </div>
  );
}
