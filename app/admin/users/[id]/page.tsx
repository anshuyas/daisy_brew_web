"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  image?: string | null;
}

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
}

const ORDERS_PER_PAGE = 10;

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Unauthorized. Please login again.");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401 || res.status === 403) {
          setError("Access denied");
          return;
        }
        if (res.status === 404) {
          setError("User not found");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const token = localStorage.getItem("auth_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, id]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#3c2825] text-lg font-medium">
        Loading user details...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <p className="text-red-600 mb-6 text-lg font-semibold">{error}</p>
        <Link
          href="/admin/users"
          className="px-6 py-3 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:bg-[#5b443f] transition"
        >
          Back to Users
        </Link>
      </div>
    );

  if (!user) return null;

  // Paginated orders
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-[#FAF5EE] rounded-2xl shadow-lg border border-[#e0d5c8]">
      <h1 className="text-3xl font-bold text-[#4B2E2B] mb-8 text-center">
        User Detail
      </h1>

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-white rounded-xl shadow-md border border-[#e6ddd0]">
        {user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.image}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-[#d9cfc0]"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-[#c2b5a4] flex items-center justify-center text-[#3c2825] font-bold text-3xl border-2 border-[#d9cfc0]">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2 text-[#3c2825]">
          <p className="text-2xl font-semibold">{user.email}</p>
          <span
            className={`inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold w-max ${
              user.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {user.role.toUpperCase()}
          </span>

          <div className="mt-4 space-y-1 text-gray-700">
            <p>
              <strong>User ID:</strong> {user._id}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/admin/users/${user._id}/edit`}
              className="px-5 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:bg-[#5b443f] transition"
            >
              Edit User
            </Link>
            <Link
              href="/admin/users"
              className="px-5 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:bg-[#5b443f] transition"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-[#4B2E2B] mb-6 border-b pb-2">
          Order History
        </h2>

        {ordersLoading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found for this user.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="bg-[#e8dcc7] text-left text-sm uppercase text-gray-700">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-mono text-sm">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">Rs. {order.total}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-s font-semibold rounded-full(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
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
              </div>
            )}
          </div>
      </div>
  );
}