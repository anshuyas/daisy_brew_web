"use client";

import LoginForm from "../_components/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#c6b391] flex items-center justify-center px-6 relative">

      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt=""
          width={80}
          height={80}
        />
      </div>

        <div className="w-full max-w-4xl min-h-[500px] bg-[#dfd5c8] rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div
          className="hidden md:block bg-cover bg-left"
          style={{ backgroundImage: "url('/images/bg.jpg')" }}
        >
          <div className="h-full w-full bg-[#4B2E2B]/20"></div>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#4B2E2B]">
              Welcome Back! 
            </h1>
            <p className="text-sm text-[#6B4F4B] mt-2">
              Sign in to explore Daisy Brew
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
