"use client";

import { authService } from "@/src/services/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const finishLogin = async () => {
      if (searchParams.get("isNewUser") === "true") {
        toast.success("Đăng nhập Google thành công! Hãy hoàn tất hồ sơ.");
        router.replace("/onboarding");
        return;
      }

      const user = await authService.getProfileMe();
      setAuth(user);
      const role = user?.role?.name || user?.role;
      router.replace(
        role === "Admin"
          ? "/admin/dashboard"
          : role === "Employer"
            ? "/employer"
            : "/",
      );
    };

    finishLogin().catch(() => {
      toast.error("Không thể đồng bộ phiên đăng nhập.");
      router.replace("/login");
    });
  }, [router, searchParams, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Đang đồng bộ tài khoản...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Đang tải...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
