"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw,
  IndianRupee,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { formatINR, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { OrderStatus } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Confirmed: "#3B82F6",
  Packed: "#A855F7",
  Shipped: "#06B6D4",
  Delivered: "#10B981",
  Cancelled: "#F43F5E",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Refresh analytics so cards and charts update immediately!
        await fetchAnalytics();
      }
    } catch (err) {
      console.error("Status update error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-surface-secondary rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-surface-secondary rounded-2xl animate-pulse" />
      </div>
    );
  }

  const { kpis, charts, recentOrders } = data || {};

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary">
            Store <span className="text-gradient">Analytics</span>
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Real-time sales, order fulfillment, and traffic overview for Kansara Creation.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-white/10 text-xs font-medium text-content-primary self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-violet/20 text-purple-300 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-content-primary">
              {kpis?.totalOrders || 0}
            </span>
            <span className="text-[11px] text-content-muted block mt-1">Across all statuses</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-amber-300">
              {kpis?.pendingOrders || 0}
            </span>
            <span className="text-[11px] text-amber-400/80 block mt-1">Awaiting fulfillment</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gradient">
              {formatINR(kpis?.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1">Active order revenue</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              This Month
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-content-primary">
              {formatINR(kpis?.monthlyIncome || 0)}
            </span>
            <span className="text-[11px] text-content-muted block mt-1">Current calendar month</span>
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION (Monthly Income + Orders by Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-base font-semibold text-content-primary">
                Monthly Revenue Trend
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Past 6 months revenue performance (in INR)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.monthlyRevenue || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27273A" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#1A1A26",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Donut Chart */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-content-primary">
              Orders by Status
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Fulfillment distribution breakdown
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.ordersByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {(charts?.ordersByStatus || []).map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#71717A"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} orders`, name]}
                  contentStyle={{
                    backgroundColor: "#1A1A26",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5">
            {(charts?.ordersByStatus || []).map((it: any) => (
              <div key={it.status} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[it.status] || "#71717A" }}
                />
                <span className="text-content-secondary truncate">{it.status}:</span>
                <strong className="text-content-primary">{it.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION (Visitors Timeline + Orders Per Day) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitors Area Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="font-display text-base font-semibold text-content-primary mb-1">
            Store Traffic (Last 14 Days)
          </h3>
          <p className="text-xs text-content-secondary mb-6">
            Daily unique customer page impressions
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.visitorsPerDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27273A" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} visitors`, "Visits"]}
                  contentStyle={{
                    backgroundColor: "#1A1A26",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fill="url(#visitorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders per day Line Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="font-display text-base font-semibold text-content-primary mb-1">
            Orders per Day (Last 14 Days)
          </h3>
          <p className="text-xs text-content-secondary mb-6">
            Daily checkout volume
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.ordersPerDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27273A" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} orders`, "Orders"]}
                  contentStyle={{
                    backgroundColor: "#1A1A26",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#EC4899"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#EC4899" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. RECENT ORDERS TABLE (with Instant Status Changer) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-content-primary">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Change status in real-time to update tracking and analytics.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-pink-300 hover:text-white inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/60 text-content-secondary border-b border-white/5 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-content-primary">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-content-primary block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-content-muted">
                        {order.city}, {order.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-content-primary">
                      {formatINR(order.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-white/10 text-[11px] text-content-primary focus:outline-none focus:border-pink-500 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-content-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
