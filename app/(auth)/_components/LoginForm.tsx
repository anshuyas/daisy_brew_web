"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    console.log("Login Data:", values);

    // Simulate async login
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate to dashboard
    router.push("/auth/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-[#FAF5EE] p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-[#4B2E2B] mb-4">Login</h2>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full rounded-md bg-[#6B4F4B] text-[#FAF5EE] font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      <div className="text-sm text-center mt-2">
        Don't have an account? <Link href="/register" className="font-semibold underline">Sign Up</Link>
      </div>
    </form>
  );
}
