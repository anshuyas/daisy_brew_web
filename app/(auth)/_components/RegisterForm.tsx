"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterData } from "../schema";
import { registerAction } from "@/lib/actions/auth-action";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      setError("");
      const result = await registerAction(values);

      if (result.success) {
        router.push("/login");
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-[#c2b5a4] p-6 rounded-xl shadow-md w-full max-w-md">

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <input
          id="name"
          type="text"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
  <label htmlFor="password" className="text-sm font-medium">Password</label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700 pr-10"
      {...register("password")}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
</div>
     <div className="space-y-1">
  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
  <div className="relative">
    <input
      id="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-brown-700 pr-10"
      {...register("confirmPassword")}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
</div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-[#3c2825] text-[#FAF5EE] font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating Account..." : "Create Account"}
      </button>
    
      <div className="text-sm text-center mt-2">
        Already have an account? <Link href="/login" className="font-semibold underline">Log in</Link>
      </div>
    </form>
  );
}
