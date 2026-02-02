"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-[#DCCDB3] px-6 py-4 shadow-md">
        <h1 className="text-3xl font-bold text-[#4B2E2B]">Daisy Brew Dashboard</h1>
        <Link
          href="/login"
          className="bg-[#4B2E2B] text-[#FAF5EE] px-4 py-2 rounded-lg hover:bg-[#6B4F4B] transition"
        >
          Logout
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Orders Card */}
        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">Orders</h2>
          <p className="text-[#6B4F4B] mb-4">View and manage your beverage orders here.</p>
          <Link
            href="/user/orders"
            className="inline-block px-4 py-2 bg-[#3C2825] text-[#FAF5EE] rounded-lg hover:bg-[#6B4F4B] transition"
          >
            Go to Orders
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">Profile</h2>
          <p className="text-[#6B4F4B] mb-4">
            Update your account info and preferences.
          </p>
          <Link
            href="/user/profile"
            className="inline-block px-4 py-2 bg-[#3C2825] text-[#FAF5EE] rounded-lg hover:bg-[#6B4F4B] transition"
          >
            Go to Profile
          </Link>
        </div>

        {/* Menu Card */}
        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">Menu</h2>
          <p className="text-[#6B4F4B] mb-4">Check the latest beverages available for ordering.</p>
          <Link
            href="/user/menu"
            className="inline-block px-4 py-2 bg-[#3C2825] text-[#FAF5EE] rounded-lg hover:bg-[#6B4F4B] transition"
          >
            View Menu
          </Link>
        </div>

        {/* Reports Card */}
        <div className="bg-[#FAF5EE] p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-3">Reports</h2>
          <p className="text-[#6B4F4B] mb-4">View your order history and analytics.</p>
          <Link
            href="/user/reports"
            className="inline-block px-4 py-2 bg-[#3C2825] text-[#FAF5EE] rounded-lg hover:bg-[#6B4F4B] transition"
          >
            View Reports
          </Link>
        </div>

      </main>
    </div>
  );
}
