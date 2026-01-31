"use client";

import Link from "next/link";

const dummyUsers = [
  { id: "1", email: "user1@example.com", role: "user" },
  { id: "2", email: "admin@example.com", role: "admin" },
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#c2b5a4] rounded-xl shadow-md mt-8">
      <h1 className="text-xl font-semibold mb-4">All Users</h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-[#3c2825] text-[#FAF5EE]">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map(user => (
            <tr key={user.id} className="text-center border-t border-gray-300">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 space-x-2">
                <Link href={`/admin/users/${user.id}`} className="text-blue-600 underline">View</Link>
                <Link href={`/admin/users/${user.id}/edit`} className="text-green-600 underline">Edit</Link>
                <button className="text-red-600 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Link href="/admin/users/create" className="px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-md hover:opacity-90">
          Create New User
        </Link>
      </div>
    </div>
  );
}
