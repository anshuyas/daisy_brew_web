"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginSchema, LoginData } from "../schema";
import { loginAction } from "@/lib/actions/auth-action";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      setError(""); 

      const result = await loginAction(values);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-[#c2b5a4] p-6 rounded-xl shadow-md w-full max-w-md">
      
      {error && <p className="text-xs text-red-600">{error}</p>} {/* backend errors */}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="hello@example.com"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-[#6B4F4B]"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-[#6B4F4B]"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="text-right mt-1">
        <Link href="/forgot-password" className="text-xs text-[#6B4F4B] hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-[#3c2825] text-[#FAF5EE] font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      <div className="text-sm text-center mt-2">
        Don't have an account? <Link href="/register" className="font-semibold underline">Sign Up</Link>
      </div>
    </form>
  );
}
