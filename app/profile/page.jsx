"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Shield, FileText, Settings, Phone, LogOut, ChevronRight, Camera } from "lucide-react"; 
import { Button, Avatar } from "@heroui/react";
import { logout, updateProfilePic } from "@/features/auth/login/store/loginSlice"; 
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import maleprofile from '@/public/maleprofile.svg';
import femaleprofile from '@/public/femaleprofile.svg';
import { fetchLegalContent, selectLegalContent, selectLegalLoading } from "@/features/profile/store/legalSlice";
import toast from "react-hot-toast"; 

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
    href: "/profile/settings",
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
  const state = useSelector((state) => state);
  const login = useSelector((state) => state.login);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // NEW: Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  useEffect(() => {
    dispatch(fetchLegalContent("privacy_policy"));
    dispatch(fetchLegalContent("terms_of_use"));
    dispatch(fetchLegalContent("contact_us"));
  }, []);

  React.useEffect(() => {
    if (!login.isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [login.isAuthenticated, router]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        dispatch(updateProfilePic(base64String)); 
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const { username, email, gender, profilePic } = login; // Added profilePic

  // NEW: Logic for image source priority
  const displayImage = profilePic || (gender === "female" ? femaleprofile : maleprofile);

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
          {/* NEW: Clickable container for image upload */}
          <div 
            className="relative cursor-pointer group" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={displayImage}
              alt="profile"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full border-4 border-white/20 flex-shrink-0 object-cover"
            />
            {/* NEW: Camera icon overlay */}
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 group-active:scale-90 transition-transform">
              <Camera size={18} className="text-[#1DA1FA]" />
            </div>
            
            {/* NEW: Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{username}</h2>
            <p className="text-sm text-white/80">{email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white flex-grow rounded-t-[40px] -mt-12 p-6 flex flex-col shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative z-20">
        <div className="flex flex-col gap-4 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
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
            </Link>
          ))}
        </div>

        <div className="mt-auto mb-4 flex justify-center">
          <Button
            className="bg-red-50 text-red-600 font-bold px-8 py-6 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}