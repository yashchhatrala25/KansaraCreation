"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-surface border border-white/10 flex items-center justify-center mx-auto mb-6 text-content-muted">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-content-primary mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-content-secondary text-sm max-w-md mx-auto mb-8">
          You haven't added any handcrafted items yet. Explore our custom calendar hoops, hair bows, and dreamcatchers to begin.
        </p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-medium">
          <span>Explore Handmade Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
            Checkout Process
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-content-primary mt-1">
            Shopping Bag ({totalItems} items)
          </h1>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-pink-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity, customNote }) => {
            const img = product.images?.[0] || "/images/products/calendar-hoop.jpg";
            return (
              <div
                key={product.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-secondary flex-shrink-0">
                    <Image src={img} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                      {product.category}
                    </span>
                    <h3 className="font-display font-medium text-base text-content-primary">
                      {product.name}
                    </h3>
                    <span className="text-xs text-pink-300 font-medium block mt-0.5">
                      {formatINR(product.price)} each
                    </span>
                    {customNote && (
                      <p className="text-xs text-content-muted mt-1 italic">
                        Custom Note: {customNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:border-white/10 sm:pl-6">
                  <div className="flex items-center rounded-xl bg-surface border border-white/10 p-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-content-secondary hover:text-content-primary rounded-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-content-primary">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-content-secondary hover:text-content-primary rounded-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-base text-content-primary block">
                      {formatINR(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-xs text-content-muted hover:text-rose-400 inline-flex items-center gap-1 mt-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-content-primary">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-content-secondary">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-content-primary font-medium">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Packaging</span>
                <span className="text-emerald-400 font-medium">FREE (Across India)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (GST)</span>
                <span className="text-content-primary font-medium">Included</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-base font-semibold text-content-primary">
                <span>Total Amount</span>
                <span className="text-xl font-bold text-gradient">{formatINR(totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full py-3.5 rounded-xl text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-glow"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 space-y-2 text-[11px] text-content-muted border-t border-white/5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>Cash on Delivery & Secure UPI available</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Dispatched with artisan protective packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
