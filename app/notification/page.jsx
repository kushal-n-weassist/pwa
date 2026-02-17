"use client";
import React, { useMemo, useEffect, useState } from "react";
import NotificationTile from "@/features/notification/components/notificationTile";
import NotificationModal from "@/features/notification/components/NotificationModal";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Notification() {

    const [hasMounted, setHasMounted] = useState(false);
    //state for modal control
    const [isModalOpen, setIsModalOpen] = useState(false);
    //state for notification
    const [selectedNotification, setSelectedNotification] = useState(null);
    //state for seen notification
    const [seenNotifications, setSeenNotifications] = useState([]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const notifications = [
        { id: 1, title: "New SSR Payment Pending", subtitle: "SSR-10-24-00", isUnread: true, date: new Date().toISOString() },
        { id: 2, title: "New SSR Payment Approved", subtitle: "SSR-10-24-00", isUnread: true, date: new Date().toISOString() },
        { id: 3, title: "New SSR Payment Rejected", subtitle: "SSR-10-24-00", isUnread: true, date: new Date().toISOString() },
        { id: 4, title: "New SSR Payment Rejected", subtitle: "SSR-10-24-00", isUnread: false, date: new Date().toISOString() },
        { id: 5, title: "New SSR Payment Rejected", subtitle: "SSR-10-24-00", isUnread: true, date: new Date().toISOString() },
    ]

    const handleTileClick = (note) => {
        setSelectedNotification(note);
        setIsModalOpen(true);
        setSeenNotifications((prev) => prev.includes(note.id) ? prev : [...prev, note.id]);
    }

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    //logic to group notifications ny date
    const groupedNotifications = useMemo(() => {
        console.log("Grouping notifications...");
        if (!hasMounted) return {}
        return notifications.reduce((groups, item) => {
            const date = new Date(item.date);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            let label = "Earlier";
            if (date.toDateString() === today.toDateString()) {
                label = "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                label = "Yesterday";
            } else {
                label = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            }

            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(item);
            return groups;
        }, {})
    }, [notifications, hasMounted]);

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
            {!hasMounted ? (
                <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
                    <div className="h-20 br-gray-100 rounded-2xl"></div>
                </div>
            ) : (
                Object.entries(groupedNotifications).map(([day, notificationList]) => {
                    return (
                        <div key={day} className="mb-6">
                            <h2 className="text-lg font-bold text-gery-900 mb-4">{day}</h2>
                            <div className="space-y-1">
                                {notificationList.map((note) => (
                                    <NotificationTile
                                        key={note.id}
                                        title={note.title}
                                        subtitle={note.subtitle}
                                        isUnread={!seenNotifications.includes(note.id)}
                                        onClick={() => handleTileClick(note)}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })
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