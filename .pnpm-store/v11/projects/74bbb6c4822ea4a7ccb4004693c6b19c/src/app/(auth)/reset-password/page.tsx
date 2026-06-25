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
        "Yêu cầu không hợp lệ. Vui lòng thực hiện lại từ trang quên mật khẩu.",
      );
      router.push("/forgot-password");
      return;
    }

    setValue("email", decodeURIComponent(email));
    setValue("otp", otp);
  }, [searchParams, setValue, router]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await axiosInstance.post("/auth/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        typeof error === "string"
          ? error
          : "Đã có lỗi xảy ra. Vui lòng thử lại!",
      );
    }
  };

  return (
    <div className="flex h-full flex-col justify-center animate-in fade-in slide-in-from-right duration-500">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="text-primary" size={32} />
      </div>

      <h2 className="mb-1 text-3xl font-extrabold tracking-tighter text-slate-950 transition-colors dark:text-white">
        Tạo mật khẩu mới
      </h2>

      <p className="mb-8 text-sm leading-relaxed text-slate-500 transition-colors dark:text-gray-400">
        Mã xác thực đã hợp lệ. Hãy thiết lập mật khẩu mới an toàn cho tài khoản
        của bạn.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="absolute right-4 top-3.5 text-slate-400 transition-colors hover:text-primary dark:text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

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
          suppressHydrationWarning
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-zinc-800"
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
        <div className="p-8 text-center text-slate-500 dark:text-gray-400">
          Đang tải...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
