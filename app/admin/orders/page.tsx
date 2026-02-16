"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@/lib/cookie";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    fullName?: string;
    email?: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = getAuthToken();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/api/orders/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:5050/api/orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-8">
      <div className="max-w-6xl mx-auto bg-[#fffaf3] p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl text-center font-bold mb-6 text-[#4B2E2B]">
          Orders Management
        </h1>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#e8dcc7] text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="p-3">
                    {order.user?.fullName || order.user?.email}
                  </td>
                  <td className="p-3">Rs. {order.total}</td>
                  <td className="p-3 capitalize">
                    {order.status}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="ready">Ready</option>
                      <option value="out">Out</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
