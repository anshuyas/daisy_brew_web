"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@/lib/cookie";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();
  console.log("Token:", token);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5050/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort unread first
      const sorted = res.data.sort((a: Notification, b: Notification) => {
        if (a.read === b.read) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return a.read ? 1 : -1;
      });
      setNotifications(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!token) return;
  fetchNotifications(); 
  const interval = setInterval(fetchNotifications, 5000); 
  return () => clearInterval(interval);
}, [token]);

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5050/api/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark as read");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading notifications...</div>;

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-8">
      <div className="max-w-4xl mx-auto bg-[#fffaf3] rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl text-center font-bold mb-6 text-[#4B2E2B]">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-600">No notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`p-4 rounded-lg border-l-4 ${
                  notif.read ? "border-gray-300 bg-gray-50" : "border-green-600 bg-green-50"
                } flex justify-between items-center`}
              >
                <div>
                  <p className="text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:opacity-90"
                  >
                    Mark Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
