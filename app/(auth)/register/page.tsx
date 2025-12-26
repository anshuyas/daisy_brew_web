"use client";

import RegisterForm from "../_components/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#9d793ac4] flex items-center justify-center px-6 relative">

      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt=""
          width={80}
          height={80}
        />
      </div>

      <div className="w-full max-w-5xl min-h-50 bg-[#FAF5EE] rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div
          className="hidden md:block bg-cover bg-right"
          style={{ backgroundImage: "url('/images/pls.jpg')" }}
        >
          <div className="h-full w-full bg-[#4B2E2B]/20"></div>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#4B2E2B]">
              Join Daisy Brew
            </h1>
            <p className="text-sm text-[#6B4F4B] mt-2">
              Sign up to start ordering your favorite beverages
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
