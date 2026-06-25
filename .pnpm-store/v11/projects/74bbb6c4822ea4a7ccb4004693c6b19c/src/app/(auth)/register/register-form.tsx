"use client";

import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { AuthInput } from "../../../components/auth/AuthInput";
import { RegisterInput } from "../../../types/auth.schema";

interface RegisterFormProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
  isSubmitting: boolean;
  onBack: () => void;
  selectedRole: string;
}

export const RegisterForm = ({
  register,
  errors,
  isSubmitting,
  onBack,
  selectedRole,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 flex flex-col justify-center h-full">
      {/* 1. Nút quay lại */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm mb-4 hover:translate-x-1 transition-all w-fit"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {/* 2. Tiêu đề (Tự động đổi màu) */}
      <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white mb-1 tracking-tighter leading-tight transition-colors">
        Thông tin {selectedRole === "Employer" ? "Doanh nghiệp" : "Cá nhân"}
      </h2>

      {/* 3. Subtitle (Việt hóa role cho chuyên nghiệp) */}
      <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm transition-colors">
        Đăng ký với tư cách:{" "}
        <b className="text-primary">
          {selectedRole === "Employer" ? "Nhà tuyển dụng" : "Ứng viên"}
        </b>
      </p>

      <div className="space-y-3">
        {/* 4. Ô nhập Tên công ty - CHỈ HIỆN KHI LÀ EMPLOYER */}
        {selectedRole === "Employer" && (
          <div className="animate-in zoom-in duration-300">
            <AuthInput
              icon={Building2}
              placeholder="Tên công ty / Doanh nghiệp"
              register={register("companyName")}
              error={errors.companyName?.message}
            />
          </div>
        )}

        {/* 5. Ô nhập Họ và tên */}
        <AuthInput
          icon={User}
          placeholder={
            selectedRole === "Employer" ? "Tên người đại diện" : "Họ và tên"
          }
          register={register("fullName")}
          error={errors.fullName?.message}
        />

        {/* 6. Ô nhập Email */}
        <AuthInput
          icon={Mail}
          placeholder="Địa chỉ Email"
          register={register("email")}
          error={errors.email?.message}
        />

        {/* 7. Ô nhập Mật khẩu */}
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

        {/* 8. Ô nhập lại Mật khẩu */}
        <AuthInput
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {/* 9. Nút Submit và Link Đăng nhập */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            suppressHydrationWarning // Chống lỗi hydration của Next.js
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-base flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-8 transition-colors">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline transition-all active:scale-95"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
