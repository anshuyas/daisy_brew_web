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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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
      fetchOrders(); // refresh list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // Filter orders based on search
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(query) ||
      order.user?.fullName?.toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-8">
      <div className="max-w-6xl mx-auto bg-[#fffaf3] p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl text-center font-bold mb-6 text-[#4B2E2B]">
          Orders Management
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, Name, or Email"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-70 border rounded px-3 py-2"
          />
        </div>

        {currentOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <>
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
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">#{order._id.slice(-6)}</td>
                    <td className="p-3">{order.user?.fullName || order.user?.email}</td>
                    <td className="p-3">Rs. {order.total}</td>
                    <td className="p-3 capitalize">{order.status}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
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

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#4B2E2B] text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded ${
                    num === currentPage ? "bg-[#4B2E2B] text-white" : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#4B2E2B] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}