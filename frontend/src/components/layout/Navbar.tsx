"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-border-subtle bg-white/80 dark:bg-surface/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dùng bg-primary và shadow-primary */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Equitas AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/" className="text-primary transition-colors">
            Trang Chủ
          </Link>
          <Link href="/jobs" className="hover:text-primary transition-colors">
            Tìm Việc Làm
          </Link>
          <Link
            href="/employer"
            className="hover:text-primary transition-colors"
          >
            Cho Nhà Tuyển Dụng
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            Về Chúng Tôi
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors px-4 py-2"
          >
            Đăng Nhập
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
          >
            Đăng Ký
          </Link>
        </div>
      </div>
    </header>
  );
};
