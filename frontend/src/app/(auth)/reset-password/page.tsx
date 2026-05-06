"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AuthInput } from "../../../components/auth/AuthInput";
import axiosInstance from "../../../lib/axios";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "../../../types/auth.schema";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (!email || !otp) {
      toast.error(
        "Yêu cầu không hợp lệ. Vui lòng thực hiện lại từ trang Quên mật khẩu.",
      );
      router.push("/forgot-password");
      return;
    }

    setValue("email", decodeURIComponent(email));
    setValue("otp", otp);
  }, [searchParams, setValue, router]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
        router.push("/login");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 flex flex-col justify-center h-full">
      {/* Icon bảo mật với màu primary */}
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="text-primary" size={32} />
      </div>

      {/* Tiêu đề tự động đổi màu */}
      <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-1 tracking-tighter transition-colors">
        Tạo mật khẩu mới
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm transition-colors leading-relaxed">
        Mã xác thực chính xác. Hãy thiết lập mật khẩu mới cực kỳ bảo mật cho tài
        khoản của sếp nhé!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Mật khẩu mới */}
        <div className="relative">
          <AuthInput
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu mới của bạn"
            register={register("newPassword")}
            error={errors.newPassword?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-slate-400 dark:text-gray-500 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Nhập lại mật khẩu */}
        <AuthInput
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Xác nhận mật khẩu mới"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning // Chống lỗi Hydration của Next.js 16/React 19
          className="w-full bg-primary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:bg-slate-300 dark:disabled:bg-zinc-800 mt-2 flex items-center justify-center"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8 text-slate-500 dark:text-gray-400">
          Đang tải...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
