"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f5efe6] text-[#3c2825]">
      
      {/* Sidebar */}
      {/* Sidebar */}
<aside className={`bg-[#c6b391] w-64 p-6 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? "block" : "hidden"} md:flex`}>
  <div>
    <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
    <nav className="flex flex-col gap-3">
      <Link
        href="/admin/dashboard"
        className="px-3 py-2 rounded-md hover:bg-[#bfa77f] hover:text-white font-semibold"
      >
        Dashboard
      </Link>
      <Link
        href="/admin/users"
        className="px-3 py-2 rounded-md hover:bg-[#bfa77f] hover:text-white font-semibold"
      >
        Manage Users
      </Link>
      {/* Add more admin links here */}
    </nav>
  </div>

  {/* Button anchored at bottom */}
  <div className="mt-auto">
    <button
      className="px-3 py-2 rounded-md bg-[#3c2825] text-white w-full hover:opacity-90"
    >
      Logout
    </button>
  </div>
</aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Mobile toggle button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden mb-4 px-3 py-2 bg-[#3c2825] text-white rounded-md"
        >
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>

        {/* Dashboard content */}
        <div className="bg-[#fff5eb] p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
          <p className="text-gray-700 mb-6">
            Welcome to admin dashboard. 
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#c2b5a4] rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Users</h2>
              <p className="text-sm text-[#3c2825]">View and manage all registered users.</p>
              <Link
                href="/admin/users"
                className="mt-3 inline-block text-sm text-[#fff] bg-[#3c2825] px-4 py-2 rounded hover:opacity-90"
              >
                Manage Users
              </Link>
            </div>

            <div className="p-6 bg-[#c2b5a4] rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Reports</h2>
              <p className="text-sm text-[#3c2825]">View system reports and analytics.</p>
              <button className="mt-3 text-sm text-[#fff] bg-[#3c2825] px-4 py-2 rounded hover:opacity-90">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
