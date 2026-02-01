"use client";

import { useEffect, useState } from "react";
import { getUserData, setUserData, UserData } from "@/lib/cookie";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function UserProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
        setEmail(userData.email);
        setRole(userData.role);
        if (userData.image) setPreview(`/uploads/${userData.image}`);
      }
    }
    fetchUser();
  }, []);

  // Preview image on selection
  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!user) return <p>Loading...</p>;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("role", role);
      if (image) formData.append("image", image);

      const result = await handleCreateUser(formData); 
      if (result.success) {
        setMessage("Profile updated successfully!");
        await setUserData(result.data);
        setUser(result.data);
      } else {
        setMessage(result.message || "Failed to update profile");
      }
    } catch (err: any) {
      setMessage(err.message || "Unexpected error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#F5F0E6] rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-[#4B2E2B]">User Profile</h1>

      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <form onSubmit={submitHandler} className="space-y-6">
        
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <label htmlFor="profileImage" className="cursor-pointer relative group">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#3c2825] transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#D9C9B3] flex items-center justify-center text-[#6B4F4B] text-lg font-medium border-4 border-[#3c2825]">
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
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-[#3c2825] text-[#FAF5EE] font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
