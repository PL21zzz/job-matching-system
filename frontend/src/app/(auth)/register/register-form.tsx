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
      {/* Nút quay lại */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-primary font-semibold text-sm mb-4 hover:translate-x-1 transition-transform w-fit"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {/* Tiêu đề */}
      <h2 className="text-3xl font-extrabold text-gray-950 mb-1 tracking-tighter leading-tight">
        Thông tin {selectedRole === "Employer" ? "Doanh nghiệp" : "Cá nhân"}
      </h2>

      {/* Subtitle */}
      <p className="text-gray-500 mb-5 text-sm">
        Đăng ký với tư cách: <b className="text-primary">{selectedRole}</b>
      </p>

      <div className="space-y-3">
        {/* Ô nhập Tên công ty - CHỈ HIỆN KHI LÀ EMPLOYER */}
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

        {/* Ô nhập Họ và tên (Dùng AuthInput cho gọn) */}
        <AuthInput
          icon={User}
          placeholder={
            selectedRole === "Employer" ? "Tên người đại diện" : "Họ và tên"
          }
          register={register("fullName")}
          error={errors.fullName?.message}
        />

        {/* Ô nhập Email */}
        <AuthInput
          icon={Mail}
          placeholder="Địa chỉ Email"
          register={register("email")}
          error={errors.email?.message}
        />

        {/* Ô nhập Mật khẩu */}
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
            className="absolute right-4 top-3.5 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Ô nhập lại Mật khẩu */}
        <AuthInput
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-[#25b5ba] active:scale-[0.98] transition-all disabled:bg-gray-400 text-base"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
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
