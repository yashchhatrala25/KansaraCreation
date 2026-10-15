"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Package,
  Calendar,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { Order } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7C3AED", "#EC4899", "#F59E0B", "#10B981"],
    });

    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to load order confirmation", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Confirmation Hero Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 text-center relative overflow-hidden mb-10">
        <div className="ambient-glow glow-pink -top-10 -right-10 opacity-20" />
        <div className="ambient-glow glow-purple -bottom-10 -left-10 opacity-20" />

        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-pink-400 block">
            Thank you for supporting handmade!
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-content-primary">
            Order Successfully Placed!
          </h1>

          <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
            Your custom handmade order has been received. Our artisans will soon begin crafting your personalized piece.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 text-xs">
            <span className="text-content-muted">Order ID:</span>
            <strong className="text-content-primary font-mono text-sm tracking-wide">
              {orderId || "KC-PENDING"}
            </strong>
          </div>
        </div>
      </div>

      {/* Order Details & Summary */}
      {order && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-content-primary">
                Order Summary
              </h2>
              <span className="text-xs text-content-muted">
                Placed on {formatDate(order.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-content-muted">Status:</span>
              <Badge status={order.status} />
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-content-secondary">
            <div className="space-y-1">
              <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px]">
                Customer & Contact
              </h4>
              <p className="text-content-primary font-medium">{order.customerName}</p>
              <p>{order.email}</p>
              <p>+91 {order.phone}</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px]">
                Delivery Address
              </h4>
              <p>{order.address}</p>
              <p>
                {order.city}, {order.state} — {order.pincode}
              </p>
              <p className="text-emerald-400 pt-1 font-medium">Payment: {order.paymentMethod}</p>
            </div>
          </div>

          {/* Items */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="font-semibold text-content-primary uppercase tracking-wider text-[11px]">
              Purchased Creations
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-white/5">
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
            <span className="text-sm font-semibold text-content-primary">Total Paid / Payable</span>
            <span className="text-2xl font-bold text-gradient">{formatINR(order.total)}</span>
          </div>
        </div>
      )}

      {/* Order Journey Timeline */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 mb-10">
        <h3 className="font-display text-base font-semibold text-content-primary">
          What Happens Next?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface/60 border border-brand-violet/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/20 text-purple-300 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="text-xs font-semibold text-content-primary">Order Verification</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              We review your custom embroidery dates and text details.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="text-xs font-semibold text-content-primary">Hand-Stitching</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Our artisans meticulously sew each knot and thread by hand.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="text-xs font-semibold text-content-primary">Packaging & Courier</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Gift-boxed with bubble protection and dispatched via express courier.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="text-xs font-semibold text-content-primary">Doorstep Joy</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Delivered safely to your door with a heartfelt thank-you card.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <a
          href="https://www.instagram.com/kansara_creation/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium text-pink-300 bg-surface hover:bg-surface-hover border border-pink-500/30 flex items-center justify-center gap-2 transition-all"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span>Follow @kansara_creation</span>
        </a>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 text-center">
          <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-content-muted">Loading your order details...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
