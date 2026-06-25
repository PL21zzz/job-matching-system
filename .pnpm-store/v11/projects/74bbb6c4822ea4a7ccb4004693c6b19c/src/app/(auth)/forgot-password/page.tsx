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
      await axiosInstance.post("/auth/forgot-password", data);

      toast.success("Mã xác thực đã được gửi vào email của bạn!");
      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&type=forgot`,
      );
    } catch (error: any) {
      toast.error(
        typeof error === "string"
          ? error
          : "Email không tồn tại trong hệ thống",
      );
    }
  };

  return (
    <div className="flex h-full flex-col justify-center animate-in fade-in slide-in-from-right duration-500">
      <Link
        href="/login"
        className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-all hover:translate-x-1 hover:text-primary-hover"
      >
        <ArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <h2 className="mb-1 text-3xl font-extrabold tracking-tighter text-slate-950 transition-colors dark:text-white">
        Quên mật khẩu?
      </h2>

      <p className="mb-8 text-sm text-slate-500 transition-colors dark:text-gray-400">
        Nhập địa chỉ email của bạn để nhận mã xác thực đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          icon={Mail}
          placeholder="Địa chỉ email của bạn"
          register={register("email")}
          error={errors.email?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-zinc-800"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi mã xác thực"}
        </button>
      </form>
    </div>
  );
}
