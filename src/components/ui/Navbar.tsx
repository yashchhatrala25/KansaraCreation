"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Don't render customer navbar on /admin routes (admin has its own sidebar)
  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-violet via-brand-pink to-brand-amber p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-glow">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-display font-semibold text-lg sm:text-xl tracking-tight text-content-primary">
                Kansara <span className="text-gradient">Creation</span>
              </span>
              <span className="hidden sm:block text-[9px] tracking-widest uppercase text-content-muted -mt-1">
                Handmade Embroidery & Crafts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-glass backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-brand-violet/20 text-pink-300 border border-brand-violet/30 shadow-sm"
                      : "text-content-secondary hover:text-content-primary hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-surface border border-white/10 text-content-primary hover:border-brand-pink/50 hover:bg-surface-hover transition-all group"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-content-primary group-hover:text-pink-300 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-brand-violet to-brand-pink text-[10px] font-bold text-white flex items-center justify-center shadow-glow-pink animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-surface border border-white/10 text-content-primary hover:bg-surface-hover transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-xl px-6 py-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-violet/20 text-pink-300 border border-brand-violet/30"
                      : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

          </nav>
        </div>
      )}
    </header>
  );
}
