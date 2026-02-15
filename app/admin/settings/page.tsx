"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { clearAuthCookies, getAuthToken, setUserData } from "@/lib/cookie";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get token on client
  useEffect(() => {
    const storedToken = getAuthToken();

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // Fetch logged-in admin info
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = res.data.user;

        // Optional: restrict to admin only
        if (user.role !== "admin") {
          router.push("/");
          return;
        }

        setFullName(user.fullName);
        setEmail(user.email);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router]);

  // Update profile
  const handleUpdateProfile = async () => {
    if (!token) return;

    try {
      const res = await axios.put(
        "http://localhost:5050/api/user/update",
        { fullName, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
      setUserData(res.data.user);
    } catch (error: any) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!token) return;

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5050/api/user/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Password change failed");
    }
  };

  // Logout
  const handleLogout = () => {
    clearAuthCookies();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-6">
      <div className="max-w-6xl mx-auto bg-[#fffaf3] rounded-2xl shadow-lg border border-[#e0d5c8] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6"></div>
      <div className="max-w-xl mx-auto bg-[white] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl text-center font-bold mb-6 text-[#4B2E2B]">
          Admin Settings
        </h1>

        {/* Profile Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Profile Information
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <button
            onClick={handleUpdateProfile}
            className="bg-[#4B2E2B] text-white px-4 py-2 rounded hover:bg-[#3a221f]"
          >
            Update Profile
          </button>
        </div>

        {/* Password Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <button
            onClick={handleChangePassword}
            className="bg-[#4B2E2B] text-white px-4 py-2 rounded hover:bg-[#3a221f]"
          >
            Change Password
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Logout
        </button>
      </div>
    </div>
    </div>
  );
}
