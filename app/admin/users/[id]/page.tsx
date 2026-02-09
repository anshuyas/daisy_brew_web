"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  image?: string | null;
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized. Please login again.");
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

        if (res.status === 401 || res.status === 403) {
          setError("Access denied");
          return;
        }

        if (res.status === 404) {
          setError("User not found");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

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

  if (loading) {
    return (
      <div className="text-center mt-20 text-[#3c2825]">
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#FAF5EE] rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6">
        User Detail
      </h1>

      {/* Profile */}
      <div className="flex items-center space-x-4 mb-6">
        {user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.image}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#c2b5a4] flex items-center justify-center text-[#3c2825] font-bold text-xl">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <p className="text-lg font-medium text-[#3c2825]">
            {user.email}
          </p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-[#3c2825]">
        <p><strong>User ID:</strong> {user._id}</p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href={`/admin/users/${user._id}/edit`}
          className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
        >
          Edit User
        </Link>

        <Link
          href="/admin/users"
          className="px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90"
        >
          Back to Users
        </Link>
      </div>
    </div>
  );
}
