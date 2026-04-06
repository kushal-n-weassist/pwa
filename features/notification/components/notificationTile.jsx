"use client";
import React from "react";
import Image from "next/image";
import ssr from "@/public/ssr.png";

//icon component
const StarOfLifeIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.172a1 1 0 0 1 .244.636l1.498 3.17c.376.866.57 1.746.57 2.547V17l3 3v7a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-7l-3-3V9.757c0-1.2 1.183-2.08 2.57-2.547l1.498-3.17z"
            />
        </svg>
    );
};


const NotificationTile = ({
    title,
    subtitle,
    isUnread = false,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="relative flex items-center w-full p-2
             mr-12 mb-3 bg-[#F4F6F9] rounded-xl cursor-pointer hover:bg-gray-200 transition-colors duration-200"
        >
            { /*Icon Container*/}
            <div className="flex-shrink-0 mr-2">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                    {/* <StarOfLifeIcon className="w-6 h-6 text-blue-500" /> */}
                    <Image src={ssr} alt="SSR" width={24} height={24} />
                </div>
            </div>

            { /*Content Container*/}
            <div className="flex flex-col flex-grow">
                <h3 className="text-base font-semibold leading-tight text-gray-700">
                    {title}
                </h3>
                <span className="mt-1 text-sm font-medium text-gray-400">
                    {subtitle}
                </span>
            </div>

            {/* Unread Indicator (Blue Dot) */}
            {isUnread && (
                <div className="absolute top-4 right-4">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default NotificationTile;