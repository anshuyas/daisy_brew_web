"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Bell,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import AdminPageWrapper from "./AdminPageWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const linkClasses = (path: string) =>
  `flex items-center gap-4 px-3 py-2 rounded-md font-semibold transition ${
    pathname === path
      ? "bg-[#3c2825] text-white"
      : "hover:bg-[#bfa77f] hover:text-white"
  }`;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  return (
    <AdminPageWrapper>
    <div className="flex min-h-screen bg-[#f7f2ed] text-[#3c2825]">
      
      {/* Sidebar */}
      <aside
        className={`bg-[#c6b391] w-64 p-6 flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden"
        } md:flex`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

          <nav className="flex flex-col gap-5">
            <Link href="/admin/dashboard" className={linkClasses("/admin/dashboard")}>
            <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link href="/admin/users" className={linkClasses("/admin/users")}>
              <Users size={18} />
              Manage Users
            </Link>

            <Link href="/admin/menu" className={linkClasses("/admin/menu")}>
              <UtensilsCrossed size={18} />
              Manage Menu
            </Link>

            <Link href="/admin/notifications" className={linkClasses("/admin/notifications")}>
              <Bell size={18} />
                Notifications
            </Link>

            <Link href="/admin/orders" className={linkClasses("/admin/orders")}>
            <ShoppingCart size={18} />
               Orders
            </Link>

            <Link href="/admin/settings" className={linkClasses("/admin/settings")}>
            <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#3c2825] text-white w-full hover:opacity-90 transition"
        >
          <LogOut size={18} />
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
    </AdminPageWrapper>
  );
}
