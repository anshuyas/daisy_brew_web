"use client";

import Link from "next/link";

const dummyUsers = [
  { id: "1", email: "user1@example.com", role: "user" },
  { id: "2", email: "user2@example.com", role: "user" },
  { id: "3", email: "user3@example.com", role: "user" },
];

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ed] p-6">
      <div className="max-w-6xl mx-auto bg-[#fffaf3] rounded-2xl shadow-lg border border-[#e0d5c8] p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4B2E2B]">Users Management</h1>
          <Link
            href="/admin/users/create"
            className="px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-lg hover:opacity-90 transition"
          >
            + Create User
          </Link>
        </div>

        {/* Table Container */}
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
              {dummyUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-[#e0d5c8] ${
                    index % 2 === 0 ? "bg-[#fffaf3]" : "bg-[#fffaf3]"
                  } hover:bg-[#f4ede1] transition`}
                >
                  <td className="p-3 text-[#4B2E2B]">{user.id}</td>
                  <td className="p-3 font-medium text-[#3c2825]">{user.email}</td>

                  {/* Role Badge */}
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

                  {/* Actions */}
                  <td className="p-3 text-center space-x-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="px-2 py-1 bg-[#f4e6d1] text-[#4B2E2B] rounded hover:bg-[#e0cda5] transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="px-2 py-1 bg-[#e0cda5] text-[#3c2825] rounded hover:bg-[#d1b689] transition"
                    >
                      Edit
                    </Link>
                    <button className="px-2 py-1 bg-[#f8d7da] text-[#721c24] rounded hover:bg-[#f5b7b9] transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
