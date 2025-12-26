"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useTransition } from "react";
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
  const [pending, setTransition] = useTransition();

  const submit = async (values: LoginData) => {
    setTransition(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Login", values);
      router.push("/auth/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-beige p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-brown-900 mb-4">Login</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          placeholder="••••••"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-brown-700 text-beige font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      <div className="text-sm text-center mt-2">
        Don't have an account? <Link href="/register" className="font-semibold underline">Sign Up</Link>
      </div>
    </form>
  );
}
