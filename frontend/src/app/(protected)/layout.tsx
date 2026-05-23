"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Hàm giải mã token lấy thông tin Role tự động
    const getRoleFromToken = (tokenStr: string | null) => {
      if (!tokenStr) return null;
      try {
        const base64Url = tokenStr.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(base64)).role || null;
      } catch (e) {
        return null;
      }
    };

    const userRole = getRoleFromToken(token);

    // 1. Trường hợp chưa đăng nhập (Không có token trong máy)
    if (!token) {
      router.replace("/login");
    }
    // 2. Tài khoản Google mới (Có token nhưng role = null) -> Ép phải ở lại trang Onboarding
    else if (token && !userRole && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
    // 3. Tài khoản cũ đã cấu hình đầy đủ (Role hợp lệ) nhưng lại cố tình vào lại Onboarding
    else if (token && userRole && pathname === "/onboarding") {
      router.replace("/");
    }
    // Đã qua các vòng kiểm tra -> Hợp lệ hoàn toàn
    else {
      setIsVerified(true);
    }
  }, [pathname, router]);

  // Hiển thị vòng xoay loading trong lúc check quyền, tránh giật giao diện
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
