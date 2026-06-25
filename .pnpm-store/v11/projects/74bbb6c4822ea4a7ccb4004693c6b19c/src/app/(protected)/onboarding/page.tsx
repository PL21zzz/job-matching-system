"use client";

import api from "@/src/lib/axios";
import { ArrowRight, Building2, Sparkles, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "Candidate" | "Employer" | null
  >(null);

  const handleCompleteOnboarding = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await api.patch("/users/onboarding", {
        role: selectedRole,
      });
      toast.success("Cấu hình vai trò thành công!");
      router.push("/profile/edit");
    } catch (error: any) {
      console.error("Lỗi cấu hình vai trò:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-white dark:bg-secondary text-slate-900 dark:text-white px-6 py-12 overflow-hidden transition-colors duration-300">
      {/* Nút thoát an toàn góc phải */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={() => {
            api.post("/auth/logout").catch(() => undefined);
            router.push("/login");
            router.refresh();
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-border-subtle hover:border-red-500/40 hover:text-red-500 text-[11px] font-bold uppercase tracking-wider transition-all bg-slate-50 dark:bg-surface/80 backdrop-blur-md"
        >
          Hủy & Đăng xuất
        </button>
      </div>

      {/* Brand Header */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="text-white dark:text-secondary" size={16} />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Equitas AI
        </span>
      </div>

      {/* Tiêu đề chính */}
      <div className="max-w-2xl w-full text-center space-y-5 mb-16 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mx-auto">
          <Sparkles size={12} /> Cấu hình tài khoản ban đầu
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
          Vai Trò Của Bạn Là Gì?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
          Lựa chọn vai trò phù hợp để hệ thống kích hoạt không gian làm việc và
          các giải pháp thuật toán tương thích.
        </p>
      </div>

      {/* Grid 2 Khối Card Chọn Vai Trò */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full z-10">
        {/* Card Ứng viên */}
        <div
          onClick={() => setSelectedRole("Candidate")}
          className={`group p-8 rounded-4xl bg-slate-50 dark:bg-surface border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-6 relative ${
            selectedRole === "Candidate"
              ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(37,181,186,0.12)] scale-[1.02]"
              : "border-slate-200 dark:border-border-subtle hover:border-primary/30 hover:bg-slate-100 dark:hover:bg-slate-900/40"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
              selectedRole === "Candidate"
                ? "bg-primary text-white dark:text-secondary"
                : "bg-white dark:bg-secondary text-primary border border-slate-200 dark:border-white/10"
            }`}
          >
            <User size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-md font-black uppercase tracking-wide">
              Tôi là Ứng viên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">
              Tìm kiếm các cơ hội việc làm hòa nhập, ứng dụng AI chấm điểm năng
              lực và kết nối doanh nghiệp nhanh chóng.
            </p>
          </div>
        </div>

        {/* Card Nhà tuyển dụng */}
        <div
          onClick={() => setSelectedRole("Employer")}
          className={`group p-8 rounded-4xl bg-slate-50 dark:bg-surface border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-6 relative ${
            selectedRole === "Employer"
              ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(37,181,186,0.12)] scale-[1.02]"
              : "border-slate-200 dark:border-border-subtle hover:border-primary/30 hover:bg-slate-100 dark:hover:bg-slate-900/40"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
              selectedRole === "Employer"
                ? "bg-primary text-white dark:text-secondary"
                : "bg-white dark:bg-secondary text-primary border border-slate-200 dark:border-white/10"
            }`}
          >
            <Building2 size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-md font-black uppercase tracking-wide">
              Nhà tuyển dụng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">
              Đăng tin tuyển dụng, tự động hóa quy trình quét dữ liệu hồ sơ và
              xây dựng môi trường văn hóa đa dạng DE&I.
            </p>
          </div>
        </div>
      </div>

      {/* Button Căn Giữa Thu Gọn */}
      <div className="mt-16 w-full max-w-xs mx-auto z-10">
        <button
          onClick={handleCompleteOnboarding}
          disabled={!selectedRole || loading}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-100 dark:disabled:bg-white/5 disabled:text-slate-400 text-white dark:text-secondary font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 active:scale-95 disabled:pointer-events-none text-xs uppercase tracking-wider"
        >
          {loading ? "Đang xử lý..." : "Hoàn tất thiết lập"}{" "}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
