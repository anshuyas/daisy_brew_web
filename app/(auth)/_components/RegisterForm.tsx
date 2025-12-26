"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterData } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setTransition] = useTransition();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const submit = async (values: RegisterData) => {
    setTransition(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Register", values);
      router.push("/login");
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-beige p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-brown-900 mb-4">Create Your Account</h2>

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="Jane Doe"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-brown-700 text-beige font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating Account..." : "Create Account"}
      </button>

      <div className="text-sm text-center mt-2">
        Already have an account? <Link href="/login" className="font-semibold underline">Log in</Link>
      </div>
    </form>
  );
}
