"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  _id: string;
  email: string;
  role: "user" | "admin";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  // Fetch users with pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();

        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError("Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  // Delete user
  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-[#3c2825]">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-6">
      <div className="max-w-6xl mx-auto bg-[#fffaf3] rounded-2xl shadow-lg border border-[#e0d5c8] p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4B2E2B]">
            Users Management
          </h1>
          <Link
            href="/admin/users/create"
            className="px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-lg hover:opacity-90"
          >
            + Create User
          </Link>
        </div>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#e8d8c4] text-[#4B2E2B] uppercase text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-[#e0d5c8] hover:bg-[#f4ede1]"
                >
                  <td className="p-3">{user._id}</td>
                  <td className="p-3 font-medium">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3 text-center space-x-2">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="px-2 py-1 bg-[#f4e6d1] rounded"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      className="px-2 py-1 bg-[#e0cda5] rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-[#f8d7da] text-[#721c24] rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-[#6B4F4B] text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-[#4B2E2B]">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-[#6B4F4B] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
