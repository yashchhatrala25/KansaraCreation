"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { validatePhone, validatePincode, validateEmail, validateRequired } from "@/lib/validations";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Gujarat",
    pincode: "",
    paymentMethod: "COD" as "COD" | "UPI",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-lg mx-auto px-4 text-center">
        <h2 className="font-display text-2xl text-content-primary mb-2">
          Your bag is empty
        </h2>
        <p className="text-xs text-content-secondary mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="btn-primary px-6 py-2.5 rounded-xl text-xs font-medium">
          Explore Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};

    const nameVal = validateRequired(formData.customerName, "Full Name");
    if (!nameVal.isValid) errs.customerName = nameVal.error!;

    const phoneVal = validatePhone(formData.phone);
    if (!phoneVal.isValid) errs.phone = phoneVal.error!;

    const emailVal = validateEmail(formData.email);
    if (!emailVal.isValid) errs.email = emailVal.error!;

    const addrVal = validateRequired(formData.address, "Delivery Address");
    if (!addrVal.isValid) errs.address = addrVal.error!;

    const cityVal = validateRequired(formData.city, "City");
    if (!cityVal.isValid) errs.city = cityVal.error!;

    const pinVal = validatePincode(formData.pincode);
    if (!pinVal.isValid) errs.pincode = pinVal.error!;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        items: items.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
          image: it.product.images?.[0] || "/images/products/calendar-hoop.jpg",
          customNote: it.customNote,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Clear cart on success
      clearCart();

      // Redirect to Order Success page
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-medium text-content-secondary hover:text-content-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="font-display text-3xl font-semibold text-content-primary">
          Complete Your <span className="text-gradient">Order</span>
        </h1>
        <p className="text-content-secondary text-xs mt-1">
          Provide your shipping details for doorstep courier delivery across India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Customer Contact */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4 flex items-center gap-2">
                <span>1. Contact & Customer Details</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="E.g., Priya Kansara"
                    className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                      errors.customerName ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                    }`}
                  />
                  {errors.customerName && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errors.customerName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                      errors.phone ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                      errors.email ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errors.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-white/5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4 flex items-center gap-2">
                <span>2. Shipping Address</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Flat, House No., Building, Street *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123, Craft Street, Sunshine Residency"
                    className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                      errors.address ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                    }`}
                  />
                  {errors.address && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{errors.address}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ahmedabad"
                      className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                        errors.city ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                      }`}
                    />
                    {errors.city && (
                      <span className="text-[11px] text-rose-400 mt-1 block">{errors.city}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Gujarat"
                      className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Pincode (6 Digits) *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="380001"
                      maxLength={6}
                      className={`w-full p-3 rounded-xl bg-surface border text-xs text-content-primary placeholder-content-muted focus:outline-none ${
                        errors.pincode ? "border-rose-500" : "border-white/10 focus:border-pink-500"
                      }`}
                    />
                    {errors.pincode && (
                      <span className="text-[11px] text-rose-400 mt-1 block">{errors.pincode}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-white/5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-300 mb-4 flex items-center gap-2">
                <span>3. Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "COD"
                      ? "bg-brand-violet/15 border-brand-violet/50 shadow-glow"
                      : "bg-surface border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === "COD"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                      className="text-pink-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-content-primary block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-content-secondary">
                        Pay with cash or UPI when your handmade parcel arrives
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-emerald-400" />
                </label>

                {/* UPI Online Placeholder */}
                <div className="p-4 rounded-xl border border-white/5 bg-surface/40 flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-content-muted" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-content-secondary">
                          UPI / Net Banking / Cards
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Coming Soon
                        </span>
                      </div>
                      <span className="text-[11px] text-content-muted">
                        PhonePe, Google Pay, Paytm gateway integration in progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-glow"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {submitting ? "Processing Order..." : `Confirm Order • ${formatINR(totalPrice)}`}
                </span>
              </button>
              <p className="text-[11px] text-content-muted text-center mt-2">
                By confirming, you agree to receive order status updates via SMS and WhatsApp.
              </p>
            </div>
          </form>
        </div>

        {/* Right: Order Summary Preview */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 sticky top-24">
            <h3 className="font-display text-lg font-semibold text-content-primary border-b border-white/10 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.product.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-secondary flex-shrink-0">
                    <Image
                      src={it.product.images?.[0] || "/images/products/calendar-hoop.jpg"}
                      alt={it.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-content-primary truncate">
                      {it.product.name}
                    </h4>
                    <span className="text-[11px] text-content-muted">
                      Qty: {it.quantity} × {formatINR(it.product.price)}
                    </span>
                    {it.customNote && (
                      <p className="text-[10px] text-pink-300 truncate">
                        Note: {it.customNote}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-content-primary">
                    {formatINR(it.product.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-content-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-content-primary font-medium">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-content-primary">
                <span>Total Payable</span>
                <span className="text-gradient text-lg">{formatINR(totalPrice)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-white/5 space-y-2 text-[11px] text-content-muted">
              <div className="flex items-center gap-2 text-content-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status will be marked as "Pending"</span>
              </div>
              <p>
                Our team will verify your address and send an order confirmation WhatsApp with estimated completion date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
