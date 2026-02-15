"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
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
                className="mt-3 inline-block text-sm text-white bg-[#3c2825] px-4 py-2 rounded hover:opacity-90"
              >
                Manage Users
              </Link>
            </div>

            <div className="p-6 bg-[#c2b5a4] rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Menu</h2>
              <p className="text-sm text-[#3c2825]">Add, update and delete menu items.</p>
               <Link
                href="/admin/menu"
                className="mt-3 inline-block text-sm text-white bg-[#3c2825] px-4 py-2 rounded hover:opacity-90"
              >
                Manage Menu
              </Link>
              </div>
              </div>
    </div>
  );
}

          