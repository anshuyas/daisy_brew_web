"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAuthToken } from "@/lib/cookie";

interface OrdersOverTime {
  _id: string;
  totalOrders: number;
  totalRevenue: number;
}

interface TopDrink {
  _id: string;
  quantity: number;
}

interface RevenueData {
  totalRevenue: number;
  averageOrder: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ordersOverTime, setOrdersOverTime] = useState<OrdersOverTime[]>([]);
  const [topDrinks, setTopDrinks] = useState<TopDrink[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      setLoadingReports(true);
      try {
        const [ordersRes, drinksRes, revenueRes] = await Promise.all([
          axios.get(
            "http://localhost:5050/api/admin/reports/orders-over-time",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get("http://localhost:5050/api/admin/reports/top-drinks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5050/api/admin/reports/revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrdersOverTime(ordersRes.data);
        setTopDrinks(drinksRes.data);
        setRevenueData(revenueRes.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [token]);

  return (
    <div className="p-8 space-y-10 bg-[#f7f2ed] min-h-screen">

      {/*  Quick Action Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Users",
            desc: "View and manage all registered users",
            link: "/admin/users",
          },
          {
            title: "Menu",
            desc: "Add, update and delete menu items",
            link: "/admin/menu",
          },
          {
            title: "Orders",
            desc: "View and manage customer orders",
            link: "/admin/orders",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 bg-[#c2b5a4] rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#3c2825]">
                {card.title}
              </h2>
              <p className="text-sm text-[#3c2825]">{card.desc}</p>
            </div>
            <Link
              href={card.link}
              className="mt-4 inline-block text-sm text-white bg-[#3c2825] px-4 py-2 rounded hover:opacity-90 text-center"
            >
              {card.title === "Reports" ? "View Reports" : `Manage ${card.title}`}
            </Link>
          </div>
        ))}
      </div>

      {/*  Reports Section  */}
      <div id="reports" className="space-y-10">
        <h2 className="text-3xl font-bold text-[#4B2E2B] text-center">
          Reports & Analytics
        </h2>

        {loadingReports ? (
          <div className="p-10 text-center text-[#3c2825] font-medium">
            Loading reports...
          </div>
        ) : (
          <>
            {/* Revenue Summary */}
            {revenueData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Revenue</h3>
                  <p className="text-2xl font-bold text-[#4B2E2B]">
                    {new Intl.NumberFormat("en-NP", {
                      style: "currency",
                      currency: "NPR",
                    }).format(revenueData.totalRevenue)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Average Order</h3>
                  <p className="text-2xl font-bold text-[#4B2E2B]">
                    {new Intl.NumberFormat("en-NP", {
                      style: "currency",
                      currency: "NPR",
                    }).format(revenueData.averageOrder)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Orders</h3>
                  <p className="text-2xl font-bold text-[#4B2E2B]">{revenueData.totalOrders}</p>
                </div>
              </div>
            )}

            {/* Orders Over Time & Top Drinks Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orders Over Time */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Orders Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ordersOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalOrders"
                      stroke="#8884d8"
                      name="Orders"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#82ca9d"
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top-Selling Drinks */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Top-Selling Drinks
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topDrinks}>
                    <defs>
                    <linearGradient id="brownGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6B4F4B" stopOpacity={0.8} />  {/* Dark Brown */}
                      <stop offset="100%" stopColor="#C2B5A4" stopOpacity={0.8} /> {/* Light Brown */}
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="url(#brownGradient)" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}