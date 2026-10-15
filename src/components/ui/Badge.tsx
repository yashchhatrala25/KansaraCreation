import React from "react";
import { OrderStatus } from "@/types";
import { getStatusBadgeConfig, cn } from "@/lib/utils";

interface BadgeProps {
  status?: OrderStatus;
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "success" | "warning";
  className?: string;
}

export default function Badge({ status, label, variant = "outline", className }: BadgeProps) {
  if (status) {
    const config = getStatusBadgeConfig(status);
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          config.bg,
          config.text,
          config.border,
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
        {config.label}
      </span>
    );
  }

  const variantStyles = {
    primary: "bg-brand-violet/15 text-purple-300 border-brand-violet/30",
    secondary: "bg-surface-hover text-content-secondary border-surface-border",
    outline: "border-white/10 text-content-secondary",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
