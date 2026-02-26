"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginSchema, LoginData } from "../schema";
import { loginAction } from "@/lib/actions/auth-action";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      setError(""); 

      const result = await loginAction(values);

    if (result.success && result.user && result.token) {
      setAuthToken(result.token);
        setUserData(result.user);

        if (result.user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } else {
        setError(result.message || "Login failed");
      }
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-[#c2b5a4] p-6 rounded-xl shadow-md w-full max-w-md">
      
      {error && <p className="text-xs text-red-600">{error}</p>} {/* backend errors */}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-[#6B4F4B]"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
  <label className="text-sm font-medium" htmlFor="password">Password</label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-[#6B4F4B] pr-10"
      {...register("password")}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
</div>

      <div className="text-right mt-1">
          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-xs text-[#6B4F4B] hover:underline"
          >
            Forgot password?
          </button>
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

    {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold text-lg"
            >
              ×
            </button>
            <ForgotPasswordForm />
          </div>
        </div>
      )}
    </>
  );
}

