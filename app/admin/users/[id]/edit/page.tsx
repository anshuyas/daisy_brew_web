"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load user");

        const data = await res.json();
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        setError("Unable to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Update user
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, role }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setMessage("User updated successfully");

      // optional redirect after save
      setTimeout(() => {
        router.push(`/admin/users/${id}`);
      }, 1000);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-[#3c2825]">
        Loading user...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#FAF5EE] rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6">
        Edit User
      </h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#3c2825]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-[#3c2825]">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
          >
            Save Changes
          </button>

          <Link
            href={`/admin/users/${id}`}
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
