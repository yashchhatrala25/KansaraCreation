"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatINR, formatDateTime, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const STATUSES: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        const json = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (statusFilter !== "All" && o.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary">
          Orders <span className="text-gradient">Manager</span>
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Review customer orders, verify custom embroidery requirements, and update dispatch tracking.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="text-xs text-content-muted self-end sm:self-auto">
            Showing <strong className="text-content-primary">{filteredOrders.length}</strong> of{" "}
            {orders.length} orders
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {STATUSES.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-violet to-brand-pink text-white shadow-glow"
                    : "bg-surface hover:bg-surface-hover text-content-secondary hover:text-content-primary border border-white/5"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/70 text-content-secondary border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-content-muted">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-content-muted">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-pink-300">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-content-primary block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-content-muted">
                        +91 {order.phone} • {order.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      {order.items?.length || 1} item(s)
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-content-secondary hover:text-white border border-white/5 transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-pink-400" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400">
                  Order Details
                </span>
                <h3 className="font-display text-xl font-bold text-content-primary mt-0.5">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-content-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status changer in modal */}
            <div className="p-4 rounded-2xl bg-surface/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-content-muted">Current Status:</span>
                <Badge status={selectedOrder.status} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-content-secondary">Change To:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="px-3 py-1.5 rounded-xl bg-surface border border-white/15 text-xs text-content-primary focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 p-4 rounded-2xl bg-surface/40 border border-white/5">
                <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Customer Contact</span>
                </h4>
                <p className="text-content-primary font-medium text-sm">
                  {selectedOrder.customerName}
                </p>
                <p className="text-content-secondary">Phone: +91 {selectedOrder.phone}</p>
                <p className="text-content-secondary">Email: {selectedOrder.email}</p>
                <p className="text-pink-300 pt-1">
                  Placed on {formatDateTime(selectedOrder.createdAt)}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-surface/40 border border-white/5">
                <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>Delivery Address</span>
                </h4>
                <p className="text-content-secondary">{selectedOrder.address}</p>
                <p className="text-content-primary font-medium">
                  {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}
                </p>
                <p className="text-emerald-400 pt-1 font-medium">
                  Payment Method: {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-3">
              <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px]">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-secondary flex-shrink-0">
                        <Image
                          src={item.image || "/images/products/calendar-hoop.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-content-primary">{item.name}</h5>
                        <span className="text-[11px] text-content-muted">
                          Qty: {item.quantity} × {formatINR(item.price)}
                        </span>
                        {(item as any).customNote && (
                          <p className="text-[11px] text-pink-300 italic mt-0.5">
                            Customization: {(item as any).customNote}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-content-primary">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-semibold text-content-primary">Order Total</span>
              <span className="text-2xl font-bold text-gradient">
                {formatINR(selectedOrder.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
