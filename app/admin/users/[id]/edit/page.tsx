"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id;

  const [email, setEmail] = useState("user1@example.com");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API update
    setMessage("User updated successfully!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#FAF5EE] rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6">Edit User</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3c2825]">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3c2825]">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
          >
            Save Changes
          </button>
          <a
            href={`/admin/users/${id}`}
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
