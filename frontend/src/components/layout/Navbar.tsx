"use client";

import { BlindAssistantLauncher } from "@/src/components/assistant/BlindAssistantLauncher";
import { authService } from "@/src/services/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
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

  const { user, isAuthenticated, isHydrated, syncAuth, logout } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      void syncAuth();
      return;
    }

    if (!isAuthenticated) {
      void authService.getProfileOptional().then((userData) => {
        if (userData) {
          void syncAuth();
        }
      });
    }
  }, [isAuthenticated, isHydrated, syncAuth, logout]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
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
    { name: "Trang chủ", href: "/" },
    { name: "Tìm việc làm", href: "/jobs" },
    { name: "Câu chuyện", href: "/stories" },
    { name: "Cho nhà tuyển dụng", href: "/employer" },
    { name: "Về chúng tôi", href: "/about" },
  ];

  const getDropdownItems = () => {
    const roleName = user?.role?.name || user?.role;

    if (roleName === "Admin" || roleName === "ADMIN") {
      return [
        {
          name: "Hệ thống quản trị",
          href: "/admin/dashboard",
          icon: ShieldAlert,
        },
        { name: "Cài đặt hệ thống", href: "/settings", icon: Settings },
      ];
    }

    return [
      { name: "Trang cá nhân", href: "/profile", icon: User },
      ...(roleName === "Candidate"
        ? [{ name: "Bài viết của tôi", href: "/stories/manage", icon: Zap }]
        : []),
      {
        name: "Bàn làm việc",
        href:
          roleName === "EMPLOYER" || roleName === "Employer"
            ? "/employer/manage-jobs"
            : "/profile",
        icon: LayoutDashboard,
      },
      { name: "Cài đặt", href: "/settings", icon: Settings },
    ];
  };

  const dropdownItems = getDropdownItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-slate-50 backdrop-blur-md transition-all dark:border-white/5 dark:bg-surface">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="z-50 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
            <Zap className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Equitas AI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${pathname === link.href ? "font-bold text-primary" : "text-slate-600 dark:text-slate-300"}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <BlindAssistantLauncher />

          {!isHydrated ? (
            <div className="h-11 w-52 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
          ) : !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-primary dark:text-slate-200"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                suppressHydrationWarning
                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-1.5 pr-3 outline-none transition-all hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 font-bold uppercase text-primary">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">
                    {user?.fullName || "Đang tải dữ liệu..."}
                  </p>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-500">
                    {user?.role?.name === "Candidate"
                      ? "Ứng viên"
                      : user?.role?.name === "Employer"
                        ? "Nhà tuyển dụng"
                        : user?.role?.name === "Admin"
                          ? "Quản trị viên"
                          : user?.role?.name || "Thành viên"}
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
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl duration-200 animate-in fade-in slide-in-from-top-2 dark:border-white/10 dark:bg-surface">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        <item.icon size={18} />
                        <span className="font-semibold">{item.name}</span>
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-slate-100 dark:bg-white/5" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
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
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          className="z-50 p-2 text-slate-600 outline-none dark:text-slate-300 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          suppressHydrationWarning
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-surface md:hidden">
          <div className="pb-2">
            <BlindAssistantLauncher />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-200 pt-3 dark:border-white/10">
            {isAuthenticated ? (
              <>
                {dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200"
                  >
                    <item.icon size={18} /> {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-500"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="rounded-xl border py-3 text-center font-bold"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-primary py-3 text-center font-bold text-white"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
