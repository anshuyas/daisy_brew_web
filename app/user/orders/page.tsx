"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { getAuthToken } from "@/lib/cookie";
import { useRouter } from "next/navigation";

interface OrderItem {
  _id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "confirmed" | "ready" | "out" | "delivered" | "cancelled";
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

useEffect(() => {
  const token = getAuthToken();
  if (!token) {
    router.replace("/login");
  }
}, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getAuthToken();

        const res = await fetch("http://localhost:5050/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusStyles: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    ready: "bg-green-100 text-green-700",
    out: "bg-yellow-100 text-yellow-700",
    delivered: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const groupOrders = (orders: OrderItem[] = []) => {
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    return orders.reduce((acc: Record<string, OrderItem[]>, order) => {
      const orderDate = dayjs(order.createdAt).startOf("day");

      if (orderDate.isSame(today))
        acc["Today"] = [...(acc["Today"] || []), order];
      else if (orderDate.isSame(yesterday))
        acc["Yesterday"] = [...(acc["Yesterday"] || []), order];
      else acc["Earlier"] = [...(acc["Earlier"] || []), order];

      return acc;
    }, {});
  };

  const groupedOrders = groupOrders(orders);

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
        <h1 className="text-4xl font-bold text-center text-[#4B2E2B] mb-8">
          Order History
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          {loading && (
            <div className="text-center text-gray-500">Loading orders...</div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center text-gray-500">
              You haven't placed any orders yet.
            </div>
          )}

          {Object.entries(groupedOrders).map(([group, orders]) => (
            <div key={group}>
              <h2 className="text-xl font-semibold text-[#4B2E2B] mb-4">
                {group}
              </h2>

              <div className="space-y-4">
                {(orders as OrderItem[]).map((order) => (
                  <div
                    key={order._id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-semibold text-[#4B2E2B]">
                          Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {dayjs(order.createdAt).format(
                            "DD MMM YYYY • hh:mm A"
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-700">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4 pt-3 border-t text-sm font-semibold text-[#4B2E2B]">
                      <span>Total</span>
                      <span>Rs. {order.total}</span>
                    </div>
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