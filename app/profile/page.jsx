"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Shield, FileText, Settings, Phone, LogOut, ChevronRight } from "lucide-react";
import { Button, Avatar } from "@heroui/react";

const menuItems = [
  {
    id: 1,
    label: "Privacy Policy",
    icon: <Shield size={20} className="text-[#1DA1FA]" />,
    bgColor: "bg-blue-50",
    href: "/profile/privacy-policy", 
  },
  {
    id: 2,
    label: "Terms and Conditions",
    icon: <FileText size={20} className="text-[#1DA1FA]" />,
    bgColor: "bg-blue-50",
    href: "/profile/terms-conditions",
  },
  {
    id: 3,
    label: "Settings",
    icon: <Settings size={20} className="text-[#1DA1FA]" />,
    bgColor: "bg-blue-50",
    href: "/settings",
  },
  {
    id: 4,
    label: "Contact Us",
    icon: <Phone size={20} className="text-[#1DA1FA]" />,
    bgColor: "bg-blue-50",
    href: "/profile/contact-us",
  },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="bg-[#1DA1FA] px-6 pt-12 pb-24 flex flex-col items-center relative">
        <div className="w-full flex items-center justify-between mb-6 relative z-10">
          <button onClick={() => router.back()} className="p-1 text-white">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <div className="w-8"></div>
        </div>

        <div className="flex flex-col items-center gap-3 z-10">
          <Avatar
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
            className="w-28 h-28 text-large border-4 border-white/20"
          />
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">Narayanan</h2>
            <p className="text-sm text-white/80">narayanan@weassist.co.in</p>
          </div>
          <Button
            className="bg-white text-[#1DA1FA] font-semibold rounded-full px-8 mt-2 shadow-md active:scale-95 transition-transform"
            size="sm"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="bg-white flex-grow rounded-t-[40px] -mt-12 p-6 flex flex-col shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative z-20">
        <div className="flex flex-col gap-4 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.href)} 
              className="flex items-center justify-between p-2 w-full active:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  {item.icon}
                </div>
                <span className="text-gray-800 font-medium text-sm">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-auto mb-4 flex justify-center">
          <Button
            className="bg-red-50 text-red-600 font-bold px-8 py-6 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center gap-2"
          >
            <LogOut size={20} />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}