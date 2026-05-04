"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Nhặt token và cờ check user mới từ URL
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser") === "true";

    if (token) {
      // 2. Lưu token vào localStorage để các request sau dùng
      localStorage.setItem("access_token", token);

      // 3. Điều hướng thông minh
      if (isNewUser) {
        toast.success("Đăng nhập thành công! Hãy hoàn tất hồ sơ nhé.");
        // Nếu là user mới, đẩy sang trang Onboarding để chọn Role & cập nhật tên
        router.push("/onboarding");
      } else {
        toast.success("Chào mừng bạn trở lại!");
        // Nếu user cũ, đẩy về trang chủ hoặc Dashboard
        router.push("/");
      }
    } else {
      toast.error("Đăng nhập thất bại, vui lòng thử lại.");
      router.push("/login");
    }
  }, [router, searchParams]);

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
