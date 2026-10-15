"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-pink" />
              <h2 className="font-display font-medium text-lg text-content-primary">
                Your Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-surface-secondary border border-white/10 flex items-center justify-center mb-4 text-content-muted">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-lg text-content-primary mb-1">
                  Your bag is empty
                </h3>
                <p className="text-content-secondary text-sm max-w-xs mb-6">
                  Explore our artisan wall hangings, hair bows, and dreamcatchers to find something you love.
                </p>
                <button
                  onClick={closeCart}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map(({ product, quantity, customNote }) => {
                const img = product.images?.[0] || "/images/products/calendar-hoop.jpg";
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3.5 rounded-xl bg-surface-secondary/70 border border-white/5 transition-all hover:border-white/10"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-content-primary line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-xs text-pink-300 font-medium">
                            {formatINR(product.price)}
                          </span>
                          {customNote && (
                            <p className="text-[11px] text-content-muted mt-0.5 italic">
                              Note: {customNote}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-content-muted hover:text-rose-400 p-1 transition-colors"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg bg-surface border border-white/10 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-medium text-content-primary">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1.5 text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-content-primary">
                          {formatINR(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-surface/90 space-y-4">
              <div className="flex items-center justify-between text-sm text-content-secondary">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE Across India</span>
              </div>
              <div className="flex items-center justify-between text-base font-medium text-content-primary">
                <span>Subtotal</span>
                <span className="text-xl font-bold text-gradient">{formatINR(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-content-muted text-center">
                Handmade with love • Each piece is individually crafted
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="px-4 py-3 rounded-xl border border-white/10 text-center text-xs font-medium text-content-primary hover:bg-surface-hover transition-colors"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary px-4 py-3 rounded-xl text-center text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
