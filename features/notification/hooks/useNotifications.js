import { useState, useEffect } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/method/weassist.api.ssr.get_self_service_notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization":
                "Basic YmU5ZDVlNjIzNmQ5MzMyOmM3OTlhYWI5MTI0YjQ2Nw==",
            },
            body: JSON.stringify({ limit: 20 }),
          },
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data.message || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading, error };
}
