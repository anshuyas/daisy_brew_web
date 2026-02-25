"use client";

import { useEffect, useState } from "react";
import { getUserData, setUserData, UserData } from "@/lib/cookie";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";

type Tab = "profile" | "settings" | "notifications";

export default function UserProfileSection() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { theme, toggleTheme, setTheme } = useTheme();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Load user data on mount
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
      setFullName(userData.fullName || "");
      setEmail(userData.email || "");
      setMobile(userData.mobile || "");
      setLocation(userData.location || "");
      if (userData.image) setPreview(`/uploads/${userData.image}`);
    }
  }, []);

  // Preview image on selection
  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Save everything locally in localStorage
      const updatedUser: UserData = {
        _id: user?._id || "",  
        fullName,
        email,
        mobile,
        location,
        image: image ? image.name : user?.image || "",
        username: user?.username || "",
        role: user?.role || "user",
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update localStorage
      await setUserData(updatedUser);
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage("Failed to update profile");
    }
    setLoading(false);
  };

  const handleLogout = () => {
     localStorage.removeItem("userData");
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");

  // Clear sessionStorage just in case
  sessionStorage.clear();

  // Clear cookies 
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // Force redirect to login
  router.replace("/login");

  };

  return (
<div className="flex min-h-screen bg-[#F2D9B3] dark:bg-[#1E1412] dark:text-white">

  {/* App Sidebar */}
  <aside className="w-24 bg-[#F7D196] flex flex-col items-center py-8 space-y-20">
    <div className="w-12 h-12 bg-[#DCCDB3] rounded-full flex items-center justify-center">
      <img src="/images/logo.png" alt="Logo" className="w-12 h-12" />
    </div>

    <Link href="/dashboard" className="text-2xl hover:scale-110 transition">
      🏠
    </Link>

    <Link href="/user/orders" className="text-2xl hover:scale-110 transition">
      📋
    </Link>

    <Link href="/user/notification" className="text-2xl hover:scale-110 transition">
      🔔
    </Link>

    <Link href="/user/profile" className="text-2xl hover:scale-110 transition">
      👤
    </Link>
  </aside>

  {/* Profile Section Wrapper */}
  <div className="flex flex-1 p-10 gap-10">
    <div className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-gray-700 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
  
  {/* Profile Image Section */}
  <div className="flex flex-col items-center mb-6">
    <label htmlFor="profileImage" className="cursor-pointer relative group">
      {preview ? (
        <img
          src={preview}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#4B2E2B] shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D9C9B3] to-[#F2D9B3] flex items-center justify-center text-[#6B4F4B] text-2xl font-bold border-4 border-[#3c2825] shadow-md">
          +
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30 rounded-full text-white text-sm font-semibold">
        Change Photo
      </div>
    </label>

    <input
      id="profileImage"
      type="file"
      accept="image/*"
      onChange={(e) =>
        setImage(e.target.files ? e.target.files[0] : null)
      }
      className="hidden"
    />

    {/* Name & Email */}
    <h2 className="mt-4 text-xl font-bold text-[#3c2825] dark:text-white text-center">
      {fullName}
    </h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
      {email}
    </p>
  </div>

  {/* Divider */}
  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 mb-6"></div>

  {/* Menu */}
  <div className="space-y-3">
    <button
      onClick={() => setActiveTab("profile")}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        activeTab === "profile"
          ? "bg-[#4B2E2B] text-white shadow-md scale-[1.02]"
          : "text-gray-700 dark:text-gray-300 hover:bg-[#F2E4D5] dark:hover:bg-gray-800 hover:scale-[1.01]"
      }`}
    >
      👤 <span>My Profile</span>
    </button>

    <button
      onClick={() => setActiveTab("settings")}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        activeTab === "settings"
          ? "bg-[#4B2E2B] text-white shadow-md scale-[1.02]"
          : "text-gray-700 dark:text-gray-300 hover:bg-[#F2E4D5] dark:hover:bg-gray-800 hover:scale-[1.01]"
      }`}
    >
      ⚙️ <span>Settings</span>
    </button>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
    >
      🚪 <span>Log Out</span>
    </button>
  </div>
</div>

      {/* Content */}
<div className="flex-1 ml-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 transition-colors duration-300">        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#3c2825]">Edit Profile</h2>
            {message && (
              <p
                className={`p-2 rounded text-center font-medium ${
                  message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#3c2825]">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4B2E2B] transition"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="mt-4 px-6 py-2 rounded-xl bg-linear-to-r from-[#4B2E2B] to-[#6B4F4B] text-white font-semibold hover:scale-105 transform transition duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">Theme</span>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:opacity-90"
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
