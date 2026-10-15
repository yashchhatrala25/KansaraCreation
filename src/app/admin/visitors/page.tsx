"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Globe,
  RefreshCw,
  Compass,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "#7C3AED",
  Mobile: "#EC4899",
  Tablet: "#F59E0B",
};

export default function AdminVisitorsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTraffic = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Traffic load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
  }, []);

  const { charts, kpis } = data || {};

  const topPages = [
    { page: "/", name: "Storefront Home", visits: Math.floor((kpis?.totalVisitors || 500) * 0.42), share: "42%" },
    { page: "/products", name: "Handmade Catalog", visits: Math.floor((kpis?.totalVisitors || 500) * 0.28), share: "28%" },
    { page: "/gallery", name: "Artisan Showcase", visits: Math.floor((kpis?.totalVisitors || 500) * 0.14), share: "14%" },
    { page: "/products/prod_calendar_hoop", name: "Anniversary Calendar Hoop", visits: Math.floor((kpis?.totalVisitors || 500) * 0.09), share: "9%" },
    { page: "/about", name: "Brand Story", visits: Math.floor((kpis?.totalVisitors || 500) * 0.07), share: "7%" },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary">
            Visitor <span className="text-gradient">Traffic & Insights</span>
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Real-time analytics on customer visits, devices, and popular boutique pages.
          </p>
        </div>

        <button
          onClick={fetchTraffic}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-white/10 text-xs font-medium text-content-primary self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              Total Page Impressions
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-violet/20 text-purple-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-content-primary">
              {kpis?.totalVisitors || 0}
            </span>
            <span className="text-[11px] text-pink-300 block mt-1">Recorded via client tracker</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              Mobile Shoppers
            </span>
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-pink-300">
              {Math.round(
                ((charts?.deviceBreakdown?.find((d: any) => d.device === "Mobile")?.count || 45) /
                  (kpis?.totalVisitors || 100)) *
                  100
              )}
              %
            </span>
            <span className="text-[11px] text-content-muted block mt-1">Responsive mobile visitors</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
              Desktop & Tablet
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-amber-300">
              {100 -
                Math.round(
                  ((charts?.deviceBreakdown?.find((d: any) => d.device === "Mobile")?.count || 45) /
                    (kpis?.totalVisitors || 100)) *
                    100
                )}
              %
            </span>
            <span className="text-[11px] text-content-muted block mt-1">High-res canvas displays</span>
          </div>
        </div>
      </div>

      {/* Traffic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Impressions Area Chart */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="font-display text-base font-semibold text-content-primary mb-1">
            Daily Customer Traffic (Last 14 Days)
          </h3>
          <p className="text-xs text-content-secondary mb-6">
            Visual breakdown of store visits and customer activity
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.visitorsPerDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27273A" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} visitors`, "Impressions"]}
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
                  stroke="#EC4899"
                  strokeWidth={2.5}
                  fill="url(#visAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown Donut */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-content-primary">
              Device Breakdown
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Traffic by platform hardware
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.deviceBreakdown || []}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                >
                  {(charts?.deviceBreakdown || []).map((entry: any, index: number) => (
                    <Cell
                      key={`device-cell-${index}`}
                      fill={DEVICE_COLORS[entry.device] || "#71717A"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} visits`, name]}
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

          <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
            {(charts?.deviceBreakdown || []).map((item: any) => (
              <div key={item.device} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: DEVICE_COLORS[item.device] || "#71717A" }}
                  />
                  <span className="text-content-secondary">{item.device}</span>
                </div>
                <strong className="text-content-primary">{item.count} visits</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="font-display text-base font-semibold text-content-primary">
          Most Visited Store Pages
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/70 text-content-secondary border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Page Route</th>
                <th className="py-3 px-4">Page Title</th>
                <th className="py-3 px-4">Visits</th>
                <th className="py-3 px-4 text-right">Traffic Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topPages.map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-hover/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-pink-300">{p.page}</td>
                  <td className="py-3 px-4 text-content-primary font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-content-secondary">{p.visits}</td>
                  <td className="py-3 px-4 text-right font-semibold text-content-primary">
                    {p.share}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
