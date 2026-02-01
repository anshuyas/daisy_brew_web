"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function CreateUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (image) formData.append("image", image);

      const result = await handleCreateUser(formData);

      if (result.success) {
        setMessage("User created successfully!");
        router.push("/admin/users");
      } else {
        setMessage(result.message || "Failed to create user");
      }
    } catch (err: any) {
      setMessage(err.message || "Unexpected error");
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ed] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[#fffaf3] rounded-2xl shadow-lg border border-[#e0d5c8] p-8">
        <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6 text-center">
          Create New User
        </h1>

        {message && (
          <p className="mb-4 text-sm text-center text-green-600 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={submitHandler} className="space-y-5">

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#4B2E2B] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#d4c5b1] focus:border-[#6B4F4B] outline-none shadow-sm transition"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#4B2E2B] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#d4c5b1] focus:border-[#6B4F4B] outline-none shadow-sm transition"
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#4B2E2B] mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#d4c5b1] focus:border-[#6B4F4B] outline-none shadow-sm transition"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#4B2E2B] mb-2">Profile Image (optional)</label>
            <div className="flex items-center gap-4">
              {/* Preview Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#e0d5c8] overflow-hidden flex items-center justify-center border border-[#d4c5b1]">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-[#6B4F4B]">No Image</span>
                )}
              </div>
              {/* Upload Button */}
              <label className="cursor-pointer px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-lg hover:opacity-90 transition text-sm">
                {image ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#3c2825] text-[#FAF5EE] font-semibold hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
