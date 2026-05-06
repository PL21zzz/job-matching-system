"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { AuthInput } from "../../../components/auth/AuthInput";
import { LoginInput } from "../../../types/auth.schema";

interface LoginFormProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  isSubmitting: boolean;
}

export const LoginForm = ({
  register,
  errors,
  isSubmitting,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tighter transition-colors">
        Chào mừng trở lại
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm transition-colors">
        Đăng nhập vào tài khoản Equitas AI của bạn
      </p>

      {/* NÚT GOOGLE */}
      <button
        type="button"
        onClick={() =>
          (window.location.href = "http://localhost:3000/auth/google")
        }
        suppressHydrationWarning
        className="w-full flex items-center justify-center gap-3 p-3.5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 transition-all mb-6 font-medium active:scale-[0.98]"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-5 h-5"
          suppressHydrationWarning
          alt="Google"
        />
        Tiếp tục với Google
      </button>

      {/* ĐƯỜNG KẺ PHÂN CÁCH */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100 dark:border-white/5"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-[#0b0f19] px-4 text-slate-400 dark:text-gray-500 font-bold tracking-widest transition-colors">
            HOẶC ĐĂNG NHẬP BẰNG EMAIL
          </span>
        </div>
      </div>

      {/* INPUTS & ACTIONS */}
      <div className="space-y-4">
        <AuthInput
          icon={Mail}
          placeholder="Địa chỉ Email"
          register={register("email")}
          error={errors.email?.message}
        />

        <div className="relative">
          <AuthInput
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            register={register("password")}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            title="Quên mật khẩu"
            className="text-xs font-bold text-primary hover:text-primary-hover transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="w-full bg-primary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:bg-slate-300 dark:disabled:bg-zinc-800 mt-2 flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập →"}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-6 transition-colors">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
