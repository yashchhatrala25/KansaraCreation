"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Visitors", href: "/admin/visitors", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {}
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background-secondary border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-pink p-[1px]">
            <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </div>
          </div>
          <span className="font-display font-semibold text-sm text-content-primary">
            Kansara Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-surface text-content-primary"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-background-secondary border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet via-brand-pink to-brand-amber p-[2px] shadow-glow">
                <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-semibold text-base text-content-primary block leading-tight">
                  Kansara
                </span>
                <span className="text-[10px] tracking-wider uppercase text-pink-300">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-content-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="mt-6 space-y-1.5">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-brand-violet/25 to-brand-pink/20 text-pink-300 border border-brand-violet/30 shadow-sm"
                      : "text-content-secondary hover:text-content-primary hover:bg-surface"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-pink-400" : "text-content-muted"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-content-muted" />
              <span>Live Website</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
