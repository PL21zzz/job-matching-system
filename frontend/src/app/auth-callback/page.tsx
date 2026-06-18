"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { jwtDecode } from "jwt-decode"; // 🚀 BỔ SUNG THẰNG NÀY ĐỂ GIẢI MÃ TOKEN GOOGLE
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser") === "true";

    if (token) {
      // 1. Lưu token vào máy
      localStorage.setItem("access_token", token);

      // 2. GIẢI MÃ TOKEN GOOGLE ĐỂ ĐỌC ROLE THẬT XUỐNG STORE
      const decodedUser: any = jwtDecode(token);
      setAuth(decodedUser);

      // 3. ĐIỀU HƯỚNG THÔNG MINH KỂ CẢ ACC GOOGLE CÓ QUYỀN ADMIN
      if (isNewUser) {
        toast.success("Đăng nhập Google thành công! Hãy hoàn tất hồ sơ nhé.");
        router.push("/onboarding");
      } else {
        toast.success("Chào mừng bạn trở lại!");

        // 🚀 RẼ NHÁNH SANG ADMIN DASHBOARD NẾU ACC GOOGLE NÀY LÀ ADMIN
        if (decodedUser.role === "Admin") {
          router.push("/admin/dashboard");
        } else if (decodedUser.role === "Employer") {
          router.push("/employer");
        } else {
          router.push("/");
        }
      }
    } else {
      toast.error("Đăng nhập thất bại, vui lòng thử lại.");
      router.push("/login");
    }
  }, [router, searchParams, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium animate-pulse">
        Đang đồng bộ hóa tài khoản Google...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Đang tải...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
