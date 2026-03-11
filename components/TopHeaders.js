"use client";
import { Avatar, Badge, Input } from "@heroui/react";
import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

export default function TopHeader() {
  const state = useSelector((state) => state.login);

  const { username } = state;

  const pathname = usePathname();
  const isOnNotification = pathname === "/notification";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            alit="profile"
            className="flex items-center gap-3 active:opacity-80 transition-opacity"
          >
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              size="md"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">Hi, {username}</h1>
              <p className="text-sm opacity-80">Welcome Back</p>
            </div>
          </Link>
        </div>
        <Link href="/notification">
          <div
            className={`p-2 rounded-full transition-opacity active:opacity-80 
        ${isOnNotification ? "bg-white/40" : "bg-white/20"}`}
          >
            <Bell className="text-white" size={24} />
          </div>
        </Link>
      </div>

      <div className="flex justify-center items-center">
        <Input
          placeholder="Search"
          variant="flat"
          startContent={<Search size={18} className="text-gray-400" />}
          className="bg-white/60 backdrop-blur-md rounded-2xl w-3/4"
          classNames={{
            innerWrapper: ["px-3", "flex", "gap-3"],
            input: ["text-[#6F92AD]"],
          }}
        />
      </div>
    </div>
  );
}
