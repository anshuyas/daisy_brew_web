"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("Check your email for password reset instructions.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#4B2E2B]">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6B4F4B] text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

      </form>
    </div>
  );
}