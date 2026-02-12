"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface OrderItem {
  id: number;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "confirmed" | "ready" | "out" | "delivered" | "cancelled";
  date: string;
}

const mockOrders: OrderItem[] = [
  {
    id: 1,
    orderNumber: "123",
    items: [
      { name: "Cappuccino", quantity: 2, price: 250 },
      { name: "Latte", quantity: 1, price: 200 },
    ],
    total: 700,
    status: "confirmed",
    date: dayjs().toISOString(),
  },
  {
    id: 2,
    orderNumber: "122",
    items: [{ name: "Espresso", quantity: 1, price: 100 }],
    total: 100,
    status: "ready",
    date: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: 3,
    orderNumber: "121",
    items: [{ name: "Mocha", quantity: 2, price: 180 }],
    total: 360,
    status: "delivered",
    date: dayjs().subtract(3, "day").toISOString(),
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const statusStyles: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    ready: "bg-green-100 text-green-700",
    out: "bg-yellow-100 text-yellow-700",
    delivered: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const groupOrders = (orders: OrderItem[]) => {
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    return orders.reduce((acc: any, order) => {
      const orderDate = dayjs(order.date).startOf("day");

      if (orderDate.isSame(today)) {
        acc["Today"] = [...(acc["Today"] || []), order];
      } else if (orderDate.isSame(yesterday)) {
        acc["Yesterday"] = [...(acc["Yesterday"] || []), order];
      } else {
        acc["Earlier"] = [...(acc["Earlier"] || []), order];
      }

      return acc;
    }, {});
  };

  const groupedOrders = groupOrders(orders);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FDEBD0] via-[#F5E0C3] to-[#F2D9B3] p-6">
      <h1 className="text-4xl font-bold text-center text-[#4B2E2B] mb-8">
        Order History
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {Object.keys(groupedOrders).length === 0 && (
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
                  key={order.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-semibold text-[#4B2E2B]">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dayjs(order.date).format("DD MMM YYYY • hh:mm A")}
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

                  {/* Items */}
                  <div className="space-y-1 text-sm text-gray-700">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
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
  );
}
