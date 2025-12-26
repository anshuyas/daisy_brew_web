"use client";

import RegisterForm from "../_components/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6] px-4">
      <div className="max-w-md w-full bg-[#FAF5EE] p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#4B2E2B]">Join Daisy Brew</h1>
          <p className="mt-2 text-sm text-[#6B4F4B]">
            Sign up to start ordering your favorite beverages
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
