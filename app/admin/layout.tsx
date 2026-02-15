"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const linkClasses = (path: string) =>
    `px-3 py-2 rounded-md font-semibold transition ${
      pathname === path
        ? "bg-[#3c2825] text-white"
        : "hover:bg-[#bfa77f] hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f2ed] text-[#3c2825]">
      
      {/* Sidebar */}
      <aside
        className={`bg-[#c6b391] w-64 p-6 flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden"
        } md:flex`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

          <nav className="flex flex-col gap-3">
            <Link href="/admin/dashboard" className={linkClasses("/admin/dashboard")}>
              Dashboard
            </Link>

            <Link href="/admin/users" className={linkClasses("/admin/users")}>
              Manage Users
            </Link>

            <Link href="/admin/menu" className={linkClasses("/admin/menu")}>
              Manage Menu
            </Link>

            <Link href="/admin/settings" className={linkClasses("/admin/settings")}>
              Settings
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-[#3c2825] text-white w-full hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64">
        {/* Mobile Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden mb-4 px-3 py-2 bg-[#3c2825] text-white rounded-md"
        >
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>

        {children}
      </main>
    </div>
  );
}
