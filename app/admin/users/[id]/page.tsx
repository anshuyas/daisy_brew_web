"use client";

import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id;

  // Dummy data for illustration 
  const user = {
    email: "user1@example.com",
    role: "user",
    createdAt: "2026-02-01",
    image: null 
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#FAF5EE] rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6">User Detail</h1>

      <div className="flex items-center space-x-4 mb-6">
        {user.image ? (
          <img src={user.image} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#c2b5a4] flex items-center justify-center text-[#3c2825] font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-lg font-medium text-[#3c2825]">{user.email}</p>
          <p className={`text-sm font-semibold mt-1 px-2 py-1 rounded-full ${
            user.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
          }`}>{user.role}</p>
        </div>
      </div>

      <div className="space-y-2 text-[#3c2825]">
        <p><strong>User ID:</strong> {id}</p>
        <p><strong>Created At:</strong> {user.createdAt}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={`/admin/users/${id}/edit`}
          className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
        >
          Edit User
        </a>
        <a
          href="/admin/users"
          className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
        >
          Back to Users
        </a>
      </div>
    </div>
  );
}
