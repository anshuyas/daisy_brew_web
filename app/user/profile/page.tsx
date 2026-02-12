"use client";

import { useEffect, useState } from "react";
import { getUserData, setUserData, UserData } from "@/lib/cookie";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

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
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-[#f0f0f0] p-10">
      {/* Sidebar */}
      <div className="w-85 bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center space-y-4">
        {/* Profile Image */}
        <label htmlFor="profileImage" className="cursor-pointer relative group">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#4B2E2B] shadow-lg mb-2 transition-transform transform hover:scale-105"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#D9C9B3] flex items-center justify-center text-[#6B4F4B] text-lg font-medium border-4 border-[#3c2825] mb-2">
              +
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/25 rounded-full text-white font-medium">
            Change
          </div>
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="hidden"
        />

        {/* Fullname & Email */}
        <h2 className="text-xl font-bold text-[#3c2825]">{fullName}</h2>
        <p className="text-gray-500 text-sm">{email}</p>

        {/* Menu */}
        <div className="w-full mt-6 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "profile"
                ? "bg-[#4B2E2B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "settings"
                ? "bg-[#4B2E2B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "notifications"
                ? "bg-[#4B2E2B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-12 bg-white rounded-3xl shadow-xl p-10 transition-all duration-300">
        {activeTab === "profile" && (
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

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md border px-3 py-1 text-sm outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="np">Nepali</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#3c2825]">Notifications</h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-gray-600 font-medium">Enable Notifications:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4B2E2B] rounded-full peer peer-checked:bg-[#4B2E2B] transition-all"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {notifications ? "Allow" : "Mute"}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
