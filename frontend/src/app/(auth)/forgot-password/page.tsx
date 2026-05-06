"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AuthInput } from "../../../components/auth/AuthInput";
import axiosInstance from "../../../lib/axios";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "../../../types/auth.schema";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Mã xác thực đã được gửi vào Email của bạn!");
        router.push(
          `/verify-otp?email=${encodeURIComponent(data.email)}&type=forgot`,
        );
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Email không tồn tại trong hệ thống";
      toast.error(msg);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 flex flex-col justify-center h-full">
      {/* 1. Nút quay lại */}
      <Link
        href="/login"
        className="flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm mb-6 hover:translate-x-1 transition-all w-fit"
      >
        <ArrowLeft size={16} /> Quay lại Đăng nhập
      </Link>

      {/* 2. Tiêu đề (Tự động đổi màu) */}
      <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-1 tracking-tighter transition-colors">
        Quên mật khẩu?
      </h2>

      {/* 3. Mô tả phụ */}
      <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm transition-colors">
        Nhập địa chỉ email của bạn để nhận mã xác thực đặt lại mật khẩu.
      </p>

      {/* 4. Form gửi */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          icon={Mail}
          placeholder="Địa chỉ Email của bạn"
          register={register("email")}
          error={errors.email?.message}
        />

        {/* Nút Submit tự động đổi tone màu và chống lỗi Hydration */}
        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="w-full bg-primary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:bg-slate-300 dark:disabled:bg-zinc-800 mt-2 flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi mã xác thực"}
        </button>
      </form>
    </div>
  );
}
