"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";
import { LoginInput, loginSchema } from "../../../types/auth.schema";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response: any = await axiosInstance.post("/auth/login", data);

      if (response?.user) {
        setAuth(response.user);
        toast.success("Đăng nhập thành công!");
        router.push("/");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác";
      const cleanMsg = Array.isArray(msg) ? msg[0] : msg;

      if (cleanMsg === "ACCOUNT_NOT_ACTIVATED") {
        toast.error(
          "Tài khoản chưa được kích hoạt! Đang chuyển hướng tới trang xác thực...",
        );

        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        }, 1500);

        return;
      }

      toast.error(cleanMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoginForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
