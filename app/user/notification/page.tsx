"use client";

import { useState, useEffect, JSX } from "react";
import dayjs from "dayjs";
import { FiCheckCircle, FiPackage, FiTruck, FiShoppingBag } from "react-icons/fi";

interface Notification {
  id: number;
  message: string;
  status: "confirmed" | "ready" | "out" | "delivered";
  date: string;
  read?: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, message: "Your order #123 is confirmed", status: "confirmed", date: dayjs().toISOString(), read: false },
  { id: 2, message: "Your order #122 is ready for pickup", status: "ready", date: dayjs().subtract(1, "day").toISOString(), read: true },
  { id: 3, message: "Your order #121 is out for delivery", status: "out", date: dayjs().subtract(2, "day").toISOString(), read: false },
  { id: 4, message: "Your order #120 was delivered", status: "delivered", date: dayjs().subtract(3, "day").toISOString(), read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const toggleRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const groupByDate = (notifs: Notification[]) => {
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    return notifs.reduce((acc: Record<string, Notification[]>, notif) => {
      const notifDate = dayjs(notif.date).startOf("day");
      if (notifDate.isSame(today)) {
        acc["Today"] = acc["Today"] ? [...acc["Today"], notif] : [notif];
      } else if (notifDate.isSame(yesterday)) {
        acc["Yesterday"] = acc["Yesterday"] ? [...acc["Yesterday"], notif] : [notif];
      } else {
        acc["Earlier"] = acc["Earlier"] ? [...acc["Earlier"], notif] : [notif];
      }
      return acc;
    }, {});
  };

  const grouped = groupByDate(notifications);

  const statusInfo: Record<string, { color: string; icon: JSX.Element }> = {
    confirmed: { color: "bg-blue-100 text-blue-800", icon: <FiCheckCircle /> },
    ready: { color: "bg-green-100 text-green-800", icon: <FiPackage /> },
    out: { color: "bg-yellow-100 text-yellow-800", icon: <FiTruck /> },
    delivered: { color: "bg-gray-100 text-gray-800", icon: <FiShoppingBag /> },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FDEBD0] via-[#F5E0C3] to-[#F2D9B3] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#4B2E2B] drop-shadow-md">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-md">
              {unreadCount} New
            </span>
          )}
        </div>

        {/* Notification Groups */}
        {Object.keys(grouped).map((dateLabel) => (
          <div key={dateLabel} className="mb-6">
            <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">{dateLabel}</h2>
            <div className="space-y-3">
              {grouped[dateLabel].map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => toggleRead(notif.id)}
                  className={`flex justify-between items-center p-4 rounded-2xl shadow-md transition cursor-pointer hover:shadow-xl ${
                    notif.read ? "bg-white/80" : "bg-white/95"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-lg ${statusInfo[notif.status].color}`}
                    >
                      {statusInfo[notif.status].icon}
                    </div>
                    <div>
                      <p className={`font-medium ${notif.read ? "text-gray-500" : "text-gray-800"}`}>
                        {notif.message}
                      </p>
                      <span className="text-gray-400 text-sm">{dayjs(notif.date).format("hh:mm A")}</span>
                    </div>
                  </div>
                  {!notif.read && (
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
