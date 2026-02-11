"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2ed] px-4">
      <div className="w-full max-w-md bg-[#fffaf3] rounded-2xl shadow-lg border border-[#e0d5c8] p-6">
        <h1 className="text-2xl font-bold text-[#4B2E2B] mb-4 text-center">
          Reset Password
        </h1>

        {message && (
          <p className="mb-4 text-green-600 text-center">{message}</p>
        )}
        {error && (
          <p className="mb-4 text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3c2825]">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3c2825]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#6B4F4B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#6B4F4B] text-[#FAF5EE] rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          <Link
            href="/login"
            className="text-[#6B4F4B] font-medium hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
