import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
