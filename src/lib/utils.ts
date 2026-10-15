import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus } from "../types/index.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function calculateOrderTotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getStatusBadgeConfig(status: OrderStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "Pending":
      return {
        label: "Pending",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    case "Confirmed":
      return {
        label: "Confirmed",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
      };
    case "Packed":
      return {
        label: "Packed",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/30",
      };
    case "Shipped":
      return {
        label: "Shipped",
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
      };
    case "Delivered":
      return {
        label: "Delivered",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/30",
      };
    default:
      return {
        label: status,
        bg: "bg-zinc-500/10",
        text: "text-zinc-400",
        border: "border-zinc-500/30",
      };
  }
}
