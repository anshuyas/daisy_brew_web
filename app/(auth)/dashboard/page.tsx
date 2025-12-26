"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#4B2E2B]">Daisy Brew Dashboard</h1>
        <Link
          href="/login"
          className="bg-[#4B2E2B] text-[#FAF5EE] px-4 py-2 rounded-lg hover:bg-[#6B4F4B] transition"
        >
          Logout
        </Link>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-2">Orders</h2>
          <p className="text-[#6B4F4B]">View and manage your beverage orders here.</p>
        </div>

        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-2">Profile</h2>
          <p className="text-[#6B4F4B]">Update your account info and preferences.</p>
        </div>

        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-2">Menu</h2>
          <p className="text-[#6B4F4B]">Check the latest beverages available for ordering.</p>
        </div>

        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-2">Reports</h2>
          <p className="text-[#6B4F4B]">View order history and analytics.</p>
        </div>
      </main>
    </div>
  );
}
