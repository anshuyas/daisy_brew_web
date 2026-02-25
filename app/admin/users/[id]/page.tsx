"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface User {
  _id: string;
  email: string;
  fullName: string; 
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

  const [editEmail, setEditEmail] = useState("");
  const [editfullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  useEffect(() => {
  if (editParam === "true" && user) {
    handleEditClick();
  }
}, [editParam]);

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

  // Handle Edit User
  const handleEditClick = () => {
    if (!user) return;
    setEditEmail(user.email);
    setEditFullName(user.fullName || "");
    setEditRole(user.role);
    setEditMessage("");
    setEditError("");
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setEditMessage("");
  setEditError("");
  setEditSaving(true);

  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editEmail,
          fullName: editfullName,
          role: editRole,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Update failed");
    }

    // Update UI instantly
    setUser((prev) =>
      prev ? { ...prev, email: editEmail, fullName: editfullName, role: editRole } : prev
    );

    setEditMessage("User updated successfully");

    setTimeout(() => {
    setEditMessage("");
    setIsEditOpen(false);
  }, 1500);

  } catch (err: any) {
    setEditError(err.message || "Failed to update user");
  } finally {
    setEditSaving(false);
  }
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
          <p className="text-2xl font-semibold">{user.fullName}
          </p>
          <p className="text-gray-600">{user.email}</p>
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
            <button
              onClick={handleEditClick}
              className="px-5 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:bg-[#5b443f] transition"
            >
              Edit User
            </button>
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
          {isEditOpen  && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-[#FAF5EE] w-full max-w-md rounded-2xl shadow-2xl p-6 border">
      <h2 className="text-xl font-bold text-[#4B2E2B] mb-4">
        Edit User
      </h2>

      {editMessage && (
        <p className="mb-3 text-sm text-green-600 font-medium">
          {editMessage}
        </p>
      )}

      {editError && (
        <p className="mb-3 text-sm text-red-600">{editError}</p>
      )}

      <form onSubmit={handleUpdateUser} className="space-y-4">
         <div>
        <label className="block text-sm font-medium text-[#3c2825] mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={editfullName}
          onChange={(e) => setEditFullName(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          placeholder="Enter full name"
        />
      </div>

        <div>
          <label className="block text-sm font-medium text-[#3c2825] mb-1">
            Email
          </label>
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6B4F4B]/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3c2825] mb-1">
            Role
          </label>
          <select
            value={editRole}
            onChange={(e) =>
              setEditRole(e.target.value as "user" | "admin")
            }
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6B4F4B]/30"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border text-[#4B2E2B] hover:bg-[#f3ece4]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={editSaving}
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {editSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
  );
}
