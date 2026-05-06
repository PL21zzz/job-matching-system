"use client";

import { Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

function VerifyOtpContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type"); // Lấy loại luồng (forgot hoặc pending)
  const isForgot = type === "forgot";
  const hasSentAutoOtp = useRef(false);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const storedEmail = localStorage.getItem("register_email");
    const finalEmail = queryEmail || storedEmail;

    if (!finalEmail) {
      toast.error("Không tìm thấy thông tin xác thực, vui lòng thử lại.");
      router.push("/register");
      return;
    }

    setEmail(finalEmail);

    if (type === "pending" && !hasSentAutoOtp.current) {
      hasSentAutoOtp.current = true;
      autoSendNewOtp(finalEmail);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [router, searchParams, type]);

  const autoSendNewOtp = async (targetEmail: string) => {
    try {
      await axiosInstance.post("/auth/resend-otp", { email: targetEmail });
      toast.success(
        "Tài khoản chưa kích hoạt. Một mã xác thực mới đã được gửi!",
      );
    } catch (error: any) {
      toast.error("Không thể tự động gửi mã OTP mới.");
    }
  };

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

  // --- XỬ LÝ LÚC BẤM NÚT XÁC THỰC ---
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isForgot) {
        const response = await axiosInstance.post("/auth/verify-forgot-otp", {
          email: email,
          code: otpCode,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Xác thực OTP thành công!");
          router.push(
            `/reset-password?email=${encodeURIComponent(email)}&otp=${otpCode}`,
          );
        }
      } else {
        const response = await axiosInstance.post("/auth/verify-register", {
          email: email,
          code: otpCode,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Xác thực thành công! Đang chuyển hướng...");
          localStorage.removeItem("register_email");
          router.push("/");
        }
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

  const handleResendOtp = async () => {
    try {
      let response;
      if (isForgot) {
        response = await axiosInstance.post("/auth/forgot-password", { email });
      } else {
        response = await axiosInstance.post("/auth/resend-otp", { email });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Mã mới đã được gửi, vui lòng check email!");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error: any) {
      toast.error("Không thể gửi lại mã");
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Zap className="text-primary" size={32} />
      </div>

      {/* Tiêu đề tự động đổi màu */}
      <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white mb-2 transition-colors">
        Nhập mã xác thực
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm transition-colors">
        Mã xác thực đã được gửi đến{" "}
        <span className="font-bold text-slate-950 dark:text-white transition-colors">
          {email}
        </span>
      </p>

      {/* 6 Ô Nhập OTP */}
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
            className="w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold outline-none transition-all
              text-slate-950 dark:text-white
              border-slate-200 dark:border-white/10
              bg-white dark:bg-[#060b13]
              focus:border-primary dark:focus:border-primary
              focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/5"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isSubmitting}
        suppressHydrationWarning // Tránh lỗi render động của trạng thái Loading trên Next.js 16
        className="w-full bg-primary text-white p-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all mb-6 disabled:bg-slate-300 dark:disabled:bg-zinc-800"
      >
        {isSubmitting ? "Đang xác thực..." : "Xác thực mã OTP"}
      </button>

      {/* Đoạn text gửi lại mã */}
      <p className="text-sm text-slate-500 dark:text-gray-400 transition-colors">
        Không nhận được mã?{" "}
        {timer > 0 ? (
          <span>Gửi lại sau {timer}s</span>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-primary font-bold hover:text-primary-hover transition-colors"
          >
            Gửi lại ngay
          </button>
        )}
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8 text-slate-500 dark:text-gray-400">
          Đang tải...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
