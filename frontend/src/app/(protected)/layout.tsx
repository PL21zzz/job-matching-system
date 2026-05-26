"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  const hasToasted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

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

    // 1. Chưa đăng nhập
    if (!token) {
      router.replace("/login");
    }
    // 2. Tài khoản Google mới chưa onboarding
    else if (token && !userRole && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
    // 3. Đã có role nhưng cố tình vào lại onboarding
    else if (token && userRole && pathname === "/onboarding") {
      router.replace("/");
    }
    // 4. CHẶN ỨNG VIÊN - PHIÊN BẢN TỐI ƯU CHỐNG SPAM TOAST
    else if (
      token &&
      userRole?.toLowerCase() === "candidate" &&
      pathname.includes("/employer")
    ) {
      if (!hasToasted.current) {
        toast.error(
          "Bạn không phải là nhà tuyển dụng! Không thể truy cập khu vực này.",
        );
        hasToasted.current = true;
      }

      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.replace("/");
      }
    }
    // Đã qua các vòng kiểm tra -> Hợp lệ hoàn toàn
    else {
      setIsVerified(true);
      hasToasted.current = false;
    }
  }, [pathname, router]);

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
