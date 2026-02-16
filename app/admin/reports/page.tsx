"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, Legend } from "recharts";
import { getAuthToken } from "@/lib/cookie";

interface OrdersOverTime {
  _id: string; // date
  totalOrders: number;
  totalRevenue: number;
}

interface TopDrink {
  _id: string; // drink name
  quantity: number;
}

interface RevenueData {
  totalRevenue: number;
  averageOrder: number;
  totalOrders: number;
}

export default function AdminReportsPage() {
  const [ordersOverTime, setOrdersOverTime] = useState<OrdersOverTime[]>([]);
  const [topDrinks, setTopDrinks] = useState<TopDrink[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [ordersRes, drinksRes, revenueRes] = await Promise.all([
          axios.get("http://localhost:5050/api/admin/reports/orders-over-time", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5050/api/admin/reports/top-drinks", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5050/api/admin/reports/revenue", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setOrdersOverTime(ordersRes.data);
        setTopDrinks(drinksRes.data);
        setRevenueData(revenueRes.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading reports...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-center font-bold mb-6">Admin Reports</h1>

      {/* Revenue Summary */}
      {revenueData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-2xl font-bold">{new Intl.NumberFormat("en-NP", {
                style: "currency",
                currency: "NPR",
             }).format(revenueData.totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Average Order</h2>
            <p className="text-2xl font-bold">{new Intl.NumberFormat("en-NP", {
                style: "currency",
                currency: "NPR",
            }).format(revenueData.totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
            <p className="text-2xl font-bold">{revenueData.totalOrders}</p>
          </div>
        </div>
      )}

      {/* Orders over time chart */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalOrders" stroke="#8884d8" name="Orders" />
            <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top-selling drinks chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Top-Selling Drinks</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDrinks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
