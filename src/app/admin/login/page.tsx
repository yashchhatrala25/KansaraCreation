"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kansara.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-background">
      {/* Background Ambients */}
      <div className="ambient-glow glow-purple top-1/4 left-1/4 opacity-25" />
      <div className="ambient-glow glow-pink bottom-1/4 right-1/4 opacity-20" />

      <div className="max-w-md w-full relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-pink p-[2px] mx-auto shadow-glow">
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-pink-400" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-content-primary">
              Admin Portal
            </h1>
            <p className="text-xs text-content-secondary">
              Sign in to manage Kansara Creation products, orders, and customer analytics.
            </p>
          </div>

          {/* Seed credentials notice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-6 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Default Seed Credentials:</span>
            </div>
            <p className="font-mono text-[11px] text-amber-200/90">
              admin@kansara.com / Admin@123
            </p>
            <p className="text-[10px] text-amber-300/70 italic">
              Please change this password in production.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kansara.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-glow mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              ← Back to Customer Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
