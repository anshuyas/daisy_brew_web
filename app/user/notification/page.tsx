"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";

export default function NotificationsPage() {
  const { notifications, toggleRead, unreadCount } = useNotification();

  // Group notifications by date
  const grouped = notifications.reduce(
    (acc: Record<string, typeof notifications>, notif) => {
      const notifDate = dayjs(notif.createdAt).startOf("day");
      const today = dayjs().startOf("day");
      const yesterday = dayjs().subtract(1, "day").startOf("day");

      const key = notifDate.isSame(today)
        ? "Today"
        : notifDate.isSame(yesterday)
        ? "Yesterday"
        : "Earlier";

      acc[key] = acc[key] ? [...acc[key], notif] : [notif];
      return acc;
    },
    {} as Record<string, typeof notifications>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-24 bg-[#F7D196] flex flex-col items-center py-8 space-y-20">
        <div className="w-12 h-12 bg-[#DCCDB3] rounded-full flex items-center justify-center">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        <Link href="/dashboard" className="text-2xl hover:scale-110 transition">
          🏠
        </Link>

        <Link href="/user/orders" className="text-2xl hover:scale-110 transition">
          📋
        </Link>

        <Link href="/user/notification" className="text-2xl hover:scale-110 transition">
          🔔
        </Link>

        <Link href="/user/profile" className="text-2xl hover:scale-110 transition">
          👤
        </Link>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-linear-to-br from-[#FDEBD0] via-[#F5E0C3] to-[#F2D9B3] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <h1 className="text-4xl font-bold text-[#4B2E2B]">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-md">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* Empty state */}
          {notifications.length === 0 && (
            <div className="text-center mt-10 text-gray-600">
              You have no notifications yet.
            </div>
          )}

          {/* Notification groups */}
          {Object.entries(grouped).map(([group, notifs]) => (
            <div key={group} className="mb-6">
              <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">
                {group}
              </h2>

              <div className="space-y-3">
                {notifs.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => toggleRead(notif._id)}
                    className={`flex justify-between items-center p-4 rounded-2xl shadow-md transition cursor-pointer hover:shadow-xl ${
                      notif.read ? "bg-white/80" : "bg-white/95"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          notif.read ? "text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <span className="text-gray-400 text-sm">
                        {dayjs(notif.createdAt).format("hh:mm A")}
                      </span>
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
    </div>
  );
}