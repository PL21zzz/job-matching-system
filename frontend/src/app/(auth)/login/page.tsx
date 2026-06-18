"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
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
      const response = await axiosInstance.post("/auth/login", data);

      if (response.status === 200 || response.status === 201) {
        const { access_token, refresh_token } = response.data;

        // 1. Lưu token vào máy
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // 2. GIẢI MÃ TOKEN ĐỂ LẤY DATA THẬT (id, email, role...)
        const decodedUser: any = jwtDecode(access_token);

        // 3. CẬP NHẬT STORE NGAY LẬP TỨC
        setAuth(decodedUser);

        toast.success("Đăng nhập thành công!");

        // 🚀 4. RẼ NHÁNH ĐIỀU HƯỚNG DỰA VÀO QUYỀN (ROLE) THỜI GIAN THỰC
        // Sếp lưu ý check lại xem trường role trong token của sếp viết hoa hay viết thường (ví dụ: "Admin", "Employer") nhé!
        if (decodedUser.role === "Admin") {
          router.push("/admin/dashboard");
        } else if (decodedUser.role === "Employer") {
          // Tiện tay xử lý nếu tài khoản nhà tuyển dụng chưa được Admin duyệt (ACTIVE)
          if (decodedUser.status === "PENDING") {
            toast.loading(
              "Tài khoản của bạn đang trong trạng thái chờ Admin phê duyệt.",
            );
            router.push("/employer"); // Vẫn cho vào trang employer giới thiệu chung hoặc trang thông báo
          } else {
            router.push("/employer");
          }
        } else {
          router.push("/"); // Ứng viên (Candidate) hoặc mặc định thì đá về trang chủ tìm việc
        }
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
