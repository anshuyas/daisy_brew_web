"use client";

import { useEffect, useState } from "react";
import { getUserData } from "@/lib/cookie";

export default function UserProfilePage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserData();
      if (userData) setUser({ email: userData.email, role: userData.role });
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#c2b5a4] rounded-xl shadow-md mt-8">
      <h1 className="text-xl font-semibold mb-4">User Profile</h1>

      <div className="mt-4 space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <button className="mt-4 px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-md hover:opacity-90">
        Update Profile
      </button>
    </div>
  );
}
