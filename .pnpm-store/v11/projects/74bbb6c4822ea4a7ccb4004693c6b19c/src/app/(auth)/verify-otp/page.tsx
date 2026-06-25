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

  const type = searchParams.get("type");
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
        "Tài khoản chưa kích hoạt. Hệ thống đã gửi lại một mã OTP mới.",
      );
    } catch {
      toast.error("Không thể tự động gửi lại mã OTP.");
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

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isForgot) {
        await axiosInstance.post("/auth/verify-forgot-otp", {
          email,
          code: otpCode,
        });

        toast.success("Xác thực OTP thành công!");
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${otpCode}`,
        );
      } else {
        await axiosInstance.post("/auth/verify-register", {
          email,
          code: otpCode,
        });

        toast.success("Xác thực thành công! Đang chuyển hướng...");
        localStorage.removeItem("register_email");
        router.push("/profile/edit");
      }
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : "Mã OTP không chính xác hoặc đã hết hạn.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (isForgot) {
        await axiosInstance.post("/auth/forgot-password", { email });
      } else {
        await axiosInstance.post("/auth/resend-otp", { email });
      }

      toast.success("Mã mới đã được gửi, vui lòng kiểm tra email.");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
    } catch {
      toast.error("Không thể gửi lại mã OTP.");
    }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Zap className="text-primary" size={32} />
      </div>

      <h2 className="mb-2 text-2xl font-extrabold text-slate-950 transition-colors dark:text-white">
        Nhập mã xác thực
      </h2>

      <p className="mb-8 text-sm text-slate-500 transition-colors dark:text-gray-400">
        Mã xác thực đã được gửi đến{" "}
        <span className="font-bold text-slate-950 transition-colors dark:text-white">
          {email}
        </span>
      </p>

      <div className="mb-8 flex justify-between gap-2">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={data}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-14 w-12 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-bold text-slate-950 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-[#0f1623] dark:text-white dark:focus:border-primary dark:focus:ring-primary/5"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isSubmitting}
        suppressHydrationWarning
        className="mb-6 w-full rounded-2xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-zinc-800"
      >
        {isSubmitting ? "Đang xác thực..." : "Xác thực mã OTP"}
      </button>

      <p className="text-sm text-slate-500 transition-colors dark:text-gray-400">
        Không nhận được mã?{" "}
        {timer > 0 ? (
          <span>Gửi lại sau {timer}s</span>
        ) : (
          <button
            onClick={handleResendOtp}
            className="font-bold text-primary transition-colors hover:text-primary-hover"
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
        <div className="p-8 text-center text-slate-500 dark:text-gray-400">
          Đang tải...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
