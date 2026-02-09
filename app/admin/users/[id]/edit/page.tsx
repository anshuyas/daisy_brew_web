"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load user");
        }

        setEmail(data.email);
        setRole(data.role);
      } catch (err: any) {
        setError(err.message || "Unable to load user");
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
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      setSaving(false);
      return;
    }

    try {
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("User updated successfully");

      setTimeout(() => {
        router.push(`/admin/users/${id}`);
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setSaving(false);
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
            onChange={(e) =>
              setRole(e.target.value as "user" | "admin")
            }
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
            disabled={saving}
            className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
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
