import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kc_admin_token")?.value;
    const session = token ? verifyAdminToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany();
    const products = await db.product.findMany();
    const visits = await db.visit.findMany();

    // 1. KPI Cards
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered");
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);

    // Current month income
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyIncome = activeOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + o.total, 0);

    // 2. Orders by status (donut chart)
    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // 3. Monthly Revenue breakdown (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenueMap: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      monthlyRevenueMap[key] = 0;
    }

    activeOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      if (monthlyRevenueMap[key] !== undefined) {
        monthlyRevenueMap[key] += o.total;
      }
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // 4. Orders per day (last 14 days)
    const ordersPerDayMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - 1000 * 60 * 60 * 24 * i);
      const key = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      ordersPerDayMap[key] = 0;
    }

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      if (ordersPerDayMap[key] !== undefined) {
        ordersPerDayMap[key]++;
      }
    });

    const ordersPerDay = Object.entries(ordersPerDayMap).map(([date, count]) => ({
      date,
      count,
    }));

    // 5. Visitors per day (last 14 days)
    const visitorsPerDayMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - 1000 * 60 * 60 * 24 * i);
      const key = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      visitorsPerDayMap[key] = 0;
    }

    visits.forEach((v) => {
      const d = new Date(v.timestamp);
      const key = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      if (visitorsPerDayMap[key] !== undefined) {
        visitorsPerDayMap[key]++;
      }
    });

    const visitorsPerDay = Object.entries(visitorsPerDayMap).map(([date, visitors]) => ({
      date,
      visitors,
    }));

    // 6. Top Products Sold
    const productSalesMap: Record<string, { name: string; sales: number; revenue: number }> = {};
    activeOrders.forEach((o) => {
      let items: any[] = [];
      try {
        items = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
      } catch {}

      items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            sales: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productId].sales += item.quantity || 1;
        productSalesMap[item.productId].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 7. Recent Orders (5 latest)
    const recentOrders = orders.slice(0, 5).map((o) => {
      let items = [];
      try {
        items = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
      } catch {}
      return {
        ...o,
        items,
      };
    });

    // 8. Device Breakdown for visitors
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    visits.forEach((v) => {
      const dev = (v.device || "desktop").toLowerCase();
      if (deviceCounts[dev] !== undefined) {
        deviceCounts[dev]++;
      } else {
        deviceCounts.desktop++;
      }
    });

    const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      count,
    }));

    return NextResponse.json({
      kpis: {
        totalOrders,
        pendingOrders,
        totalRevenue,
        monthlyIncome,
        totalProducts: products.length,
        totalVisitors: visits.length,
      },
      charts: {
        monthlyRevenue,
        ordersByStatus,
        ordersPerDay,
        visitorsPerDay,
        topProducts,
        deviceBreakdown,
      },
      recentOrders,
    });
  } catch (err: any) {
    console.error("Analytics GET error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
