"use client";

import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-secondary">
      {/* Khối Header xuất hiện cố định cho tất cả các trang profile, profile/edit */}
      <Navbar />

      {/* Nội dung chính của các trang con */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
