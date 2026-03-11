import NotificationTile from "./notificationTile";
import React, { useMemo } from "react";
export default function NotificationList({
  notifications,
  seenNotifications,
  onTileClick,
}) {
  const groupedNotifications = useMemo(() => {
    console.log("Grouping notifications...");
    return notifications.reduce((groups, item) => {
      const date = new Date(item.creation.replace(" ", "T"));
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label;
      if (isNaN(date)) {
        label = "Earlier"; // fallback if date is still invalid
      } else if (date.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      } else {
        label = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(item);
      return groups;
    }, {});
  }, [notifications]);

  if (!notifications.length) {
    return (
      <p className="text-center text-gray-400 mt-8">No notifications yet.</p>
    );
  }

  return Object.entries(groupedNotifications).map(([day, notificationList]) => (
    <div key={day} className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{day}</h2>
      <div className="space-y-1">
        {notificationList.map((note) => (
          <NotificationTile
            key={note.name}
            title={note.subject}
            subtitle={note.document_name}
            isUnread={!seenNotifications.includes(note.name)}
            onClick={() => onTileClick(note)}
          />
        ))}
      </div>
    </div>
  ));
}
