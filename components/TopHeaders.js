"use client";
import { Avatar, Badge, Input } from "@heroui/react";
import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function TopHeader() {


    const state = useSelector((state)=>state.login);

    const {username } = state;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                <Link href='/profile' alit="profile" className="flex items-center gap-3 active:opacity-80 transition-opacity">
                     <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="md" />
                    <div className="text-white">
                        <h1 className="text-xl font-bold">Hi, {username}</h1>
                        <p className="text-sm opacity-80">Welcome Back</p>
                    </div>
                </Link>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                    <Bell className="text-white" size={24} />
                </div>
            </div>

            <div className="flex justify-center items-center">
                <Input
                    placeholder="Search"
                    variant="flat"
                    startContent={<Search size={18} className="text-gray-400" />}
                    className="bg-white/60 backdrop-blur-md rounded-2xl w-3/4"
                    classNames={{
                        innerWrapper:[
                            "px-3",
                            "flex",
                            "gap-3",
                        ],
                        input:[
                            "text-[#6F92AD]"
                        ]
                    }}
                />
            </div>

        </div>
    );
}