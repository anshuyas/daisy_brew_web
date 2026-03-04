"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  toggleRead: (id: string) => Promise<void>;
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get token from cookies
  const getToken = () => Cookies.get("auth_token");

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5050/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Fetch on mount and poll for updates
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markAsRead = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:5050/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const toggleRead = async (id: string) => {
    const notif = notifications.find(n => n._id === id);
    if (!notif) return;
    if (!notif.read) await markAsRead(id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        toggleRead,
        unreadCount,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
