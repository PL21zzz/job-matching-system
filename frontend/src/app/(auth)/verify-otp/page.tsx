"use client";

import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60); // Bộ đếm ngược 60 giây
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("register_email");
    if (!storedEmail) {
      toast.error("Không tìm thấy thông tin đăng ký, vui lòng thử lại.");
      router.push("/register");
      return;
    }
    setEmail(storedEmail);

    // Logic đếm ngược
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- HÀM GỌI API XÁC THỰC ---
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/verify-register", {
        email: email,
        code: otpCode,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Xác thực thành công! Đang chuyển hướng...");
        localStorage.removeItem("register_email");
        router.push("/");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Mã OTP không chính xác hoặc đã hết hạn";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HÀM GỬI LẠI MÃ XÁC THỰC ---
  const handleResendOtp = async () => {
    try {
      const response = await axiosInstance.post("/auth/resend-otp", {
        email: email,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Mã mới đã được gửi, vui lòng check email!");
        setTimer(60); // Reset lại bộ đếm ngược về 60s
        setOtp(["", "", "", "", "", ""]); // Xóa đống mã cũ cho đỡ nhầm
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể gửi lại mã";
      toast.error(msg);
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Zap className="text-primary" size={32} />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-950 mb-2">
        Nhập mã xác thực
      </h2>
      <p className="text-gray-500 mb-8 text-sm">
        Mã đã gửi đến <span className="font-bold text-gray-950">{email}</span>
      </p>

      <div className="flex justify-between gap-2 mb-8">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={data}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold text-gray-950 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isSubmitting}
        className="w-full bg-primary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-[#25b5ba] transition-all mb-6 disabled:bg-gray-400"
      >
        {isSubmitting ? "Đang xác thực..." : "Xác thực tài khoản"}
      </button>

      <p className="text-sm text-gray-500">
        Không nhận được mã?{" "}
        {timer > 0 ? (
          <span>Gửi lại sau {timer}s</span>
        ) : (
          <button onClick={handleResendOtp} className="text-primary font-bold">
            Gửi lại ngay
          </button>
        )}
      </p>
    </div>
  );
}
