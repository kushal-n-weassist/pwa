import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.login.userToken);

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
              Authorization: token ? `Basic ${token}` : "",
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
  }, [token]);

  return { notifications, loading, error };
}
