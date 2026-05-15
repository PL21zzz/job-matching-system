"use client";

import api from "@/src/lib/axios"; // 🚨 Dùng instance 'api' có Interceptor
import { useAuthStore } from "@/src/store/useAuthStore";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  // Đồng bộ thông tin User từ DB khi vào trang
  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token && !isAuthenticated) {
        try {
          const response = await api.get("/auth/me");
          setAuth(response.data);
        } catch (error: any) {
          // if (error.response?.status === 401)
          logout();
        }
      }
    };
    syncAuth();
  }, [isAuthenticated, setAuth, logout]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
      toast.success("Đã đăng xuất");
    }
  };

  const navLinks = [
    { name: "Trang Chủ", href: "/" },
    { name: "Tìm Việc Làm", href: "/jobs" },
    { name: "Cho Nhà Tuyển Dụng", href: "/employer" },
    { name: "Về Chúng Tôi", href: "/about" },
  ];

  const dropdownItems = [
    { name: "Trang cá nhân", href: "/profile", icon: User },
    {
      name: "Bàn làm việc",
      href:
        user?.role?.name === "EMPLOYER"
          ? "/employer/dashboard"
          : "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Cài đặt", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-secondary/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Equitas AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-bold" : "text-slate-600 dark:text-slate-300"}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary px-4 py-2"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
              >
                Đăng Ký
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                suppressHydrationWarning
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {user?.fullName || "Đang tải..."}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 font-medium mt-1 uppercase tracking-tighter">
                    {user?.role?.name || "Thành viên"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors"
                      >
                        <item.icon size={18} />{" "}
                        <span className="font-semibold">{item.name}</span>
                      </Link>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold"
                    >
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 z-50 outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          suppressHydrationWarning
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-white dark:bg-secondary z-40 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          <nav className="flex flex-col items-center gap-6 text-xl font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={
                  pathname === link.href
                    ? "text-primary"
                    : "text-slate-900 dark:text-white"
                }
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col w-full gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 text-center font-bold text-slate-700 dark:text-slate-200"
              >
                Đăng Nhập
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-4 text-center font-bold text-red-500"
              >
                Đăng xuất
              </button>
            )}
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-4 text-center font-bold bg-primary text-white rounded-2xl"
            >
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
