"use client";
import React, { useMemo, useEffect, useState } from "react";
import useNotification from "@/features/notification/hooks/useNotifications";
import NotificationModal from "@/features/notification/components/NotificationModal";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const NotificationList = dynamic(() => import("@/features/notification/components/NotificationList"), {
    ssr: false,
    loading: () => <div className="animate-pulse flex flex-col space-y-4">
        <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
        <div className="h-20 br-gray-100 rounded-2xl"></div>
    </div>,
})
export default function Notification() {
    //state for modal control
    const [isModalOpen, setIsModalOpen] = useState(false);
    //state for notification
    const [selectedNotification, setSelectedNotification] = useState(null);
    //state for seen notification
    const [seenNotifications, setSeenNotifications] = useState([]);

    const { notifications, loading, error } = useNotification();

    
    const router = useRouter();
    
    const handleBack = () => {
        router.back();
    };
    
    const handleTileClick = (note) => {
        setSelectedNotification(note);
        setIsModalOpen(true);
        setSeenNotifications((prev) => prev.includes(note.id) ? prev : [...prev, note.name]);
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
            {/* header area */}
            <header className="flex items-center mb-8">
                <button className="text-xl mr-auto font-bold" onClick={handleBack}>
                    <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow pr-6">Notification</h1>
            </header>
            {/* Render Notifications */}
            { loading && (
                <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
                    <div className="h-20 br-gray-100 rounded-2xl"></div>
                </div>
            )}
            { error && <p className="text-red-500 text-center mt-8">Failed to load notifications: {error}</p>}
            { !loading && !error && (
                <NotificationList
                    notifications={notifications}
                    seenNotifications={seenNotifications}
                    onTileClick={handleTileClick}
                />
            )}
            {/* Modal */}
            <NotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(!isModalOpen)}
                data={selectedNotification}
            />
        </div>
    );
}