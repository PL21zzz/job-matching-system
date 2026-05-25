"use client";

import api from "@/src/lib/axios";
import {
  Accessibility,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  FileText,
  Info,
  MapPin,
  Phone,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileEmpty, setIsProfileEmpty] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        let userRole = "";
        if (token) {
          const payload = JSON.parse(window.atob(token.split(".")[1]));
          setRole(payload.role);
          userRole = payload.role;
        }

        const response = await api.get("/users/profile/me");
        const data = response.data;
        setProfile(data);

        if (userRole === "Candidate") {
          const cp = data.candidateProfile;
          if (!cp || !cp.dob || !cp.phone || !cp.address)
            setIsProfileEmpty(true);
        } else if (userRole === "Employer") {
          const ep = data.employerProfile;
          if (!ep || !ep.companyName || !ep.taxCode) setIsProfileEmpty(true);
        }
      } catch (error) {
        console.error("Lỗi đồng bộ hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase animate-pulse">
            Đang nạp cấu trúc Bento...
          </p>
        </div>
      </div>
    );

  return (
    <div className="transition-colors duration-300 bg-white dark:bg-secondary min-h-screen py-16 px-4 sm:px-6 lg:px-8 selection:bg-primary/20">
      {/* Container ép khung max-w-7xl chuẩn hàng lối với Navbar */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ================= 1. BANNER CẢNH BÁO HOÀN THIỆN ================= */}
        {isProfileEmpty && (
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="text-amber-500" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Hồ sơ của sếp chưa hoàn thiện!
                </h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-amber-500/60 mt-0.5">
                  Vui lòng cập nhật đầy đủ thông tin để AI bắt đầu kết nối việc
                  làm chính xác nhé.
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white dark:text-secondary text-xs font-black uppercase tracking-wider transition-all shadow-lg shrink-0 active:scale-95"
            >
              Điền hồ sơ ngay
            </Link>
          </div>
        )}

        {/* ================= 2. HERO HEADER ================= */}
        <div className="p-8 md:p-10 rounded-4xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col sm:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none"></div>

          {/* Khung Tròn Glow Viền Neon */}
          <div className="relative shrink-0 w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-purple-600 blur-md opacity-40"></div>
            <div className="w-full h-full rounded-full bg-linear-to-tr from-primary to-purple-600 p-1 relative z-10 shadow-xl flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-white dark:bg-surface flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-white dark:bg-surface p-1.5 rounded-full z-20 shadow-md border border-slate-200 dark:border-border-subtle">
              <CheckCircle2 size={16} className="text-primary" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2.5 z-10">
            <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white leading-none">
              {profile?.fullName || "Chưa cập nhật tên"}
            </h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">
              {profile?.email}
            </p>

            <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
              <Link
                href="/profile/edit"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white dark:text-secondary text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-primary/10 active:scale-95"
              >
                <Edit3 size={13} /> Chỉnh sửa profile
              </Link>
              <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-secondary hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-border-subtle flex items-center gap-1.5">
                <Share2 size={13} /> Chia sẻ
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3. BENTO GRID ĐIỀU KIỆN THEO ROLE ================= */}
        <div className="w-full">
          {/* LUỒNG GIAO DIỆN: CANDIDATE */}
          {role === "Candidate" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
                <Zap size={14} className="text-primary" /> Thông tin cá nhân ứng
                viên
              </div>

              {/* Grid 3 cột dãn cách cực rộng rãi đúng chuẩn Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <BentoCard
                  icon={Calendar}
                  label="Ngày sinh"
                  value={
                    profile?.candidateProfile?.dob
                      ? new Date(
                          profile.candidateProfile.dob,
                        ).toLocaleDateString("vi-VN")
                      : "15/05/1995"
                  }
                />
                <BentoCard
                  icon={Phone}
                  label="Số điện thoại"
                  value={profile?.candidateProfile?.phone || "+84 905 123 456"}
                />

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col justify-between space-y-3 shadow-md min-h-27.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <ShieldCheck size={14} className="text-primary" /> Trạng
                    thái hồ sơ
                  </div>
                  <p className="text-sm font-black text-primary flex items-center gap-1.5 uppercase tracking-wide">
                    Đã xác thực danh tính
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col justify-between space-y-3 shadow-md md:col-span-3 min-h-27.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <MapPin size={14} className="text-primary" /> Địa chỉ cư trú
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {profile?.candidateProfile?.address ||
                      "Chưa cập nhật chi tiết địa chỉ thường trú."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LUỒNG GIAO DIỆN: EMPLOYER */}
          {role === "Employer" && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Khối thông tin doanh nghiệp */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
                  <Building2 size={14} className="text-primary" /> Thông tin
                  doanh nghiệp
                </div>

                {/* Sửa lại Grid chia 3 cột cân xứng tuyệt đối */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="md:col-span-2">
                    <BentoCard
                      icon={Building2}
                      label="Tên công ty"
                      value={
                        profile?.employerProfile?.companyName ||
                        "Chưa cập nhật tên pháp nhân"
                      }
                    />
                  </div>
                  <BentoCard
                    icon={FileText}
                    label="Mã số thuế"
                    value={
                      profile?.employerProfile?.taxCode ||
                      "Chưa cấu hình mã số thuế"
                    }
                  />

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col justify-between space-y-3 shadow-md md:col-span-3 min-h-27.5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <MapPin size={14} className="text-primary" /> Địa chỉ văn
                      phòng
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {profile?.employerProfile?.address ||
                        "Chưa cập nhật vị trí văn phòng chính."}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col justify-between space-y-3 shadow-md md:col-span-3 min-h-35">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <Info size={14} className="text-primary" /> Mô tả hoạt
                      động doanh nghiệp
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {profile?.employerProfile?.description ||
                        "Doanh nghiệp chưa cập nhật bảng giới thiệu tóm tắt."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Khối hạ tầng trợ năng đặc quyền */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
                  <Accessibility size={14} className="text-primary" /> Tiện ích
                  hạ tầng
                </div>

                <div className="p-8 md:p-10 rounded-[2.5rem] border border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

                  <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest mb-8">
                    <Accessibility size={20} /> Hạ tầng trợ năng hỗ trợ người
                    khuyết tật hiện có
                  </div>

                  {/* Hệ thống card trợ năng với gap dãn cách thoáng đạt */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard
                      title="Lối đi xe lăn"
                      desc={
                        profile?.employerProfile?.accessibilityFeatures ||
                        "Sẵn có tại sảnh chính và các tầng văn phòng làm việc."
                      }
                      active={true}
                    />
                    <FeatureCard
                      title="Hỗ trợ khiếm thính"
                      desc="Hệ thống phiên dịch ngôn ngữ ký hiệu ảo tích hợp tại phòng họp trung tâm."
                      active={true}
                    />
                    <FeatureCard
                      title="Phòng vệ sinh trợ năng"
                      desc="Hệ thống tay vịn trợ lực đạt tiêu chuẩn tiếp cận hòa nhập quốc tế."
                      active={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component thẻ Bento phụ trợ dãn chiều cao linh hoạt
function BentoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col justify-between space-y-3 shadow-md hover:border-primary/30 transition-colors group min-h-27.5">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <Icon
          size={14}
          className="text-primary group-hover:scale-110 transition-transform"
        />{" "}
        {label}
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
        {value}
      </p>
    </div>
  );
}

// Thẻ tính năng hạ tầng trợ năng phủ bóng sâu
function FeatureCard({
  title,
  desc,
  active,
}: {
  title: string;
  desc: string;
  active: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 ${active ? "border-primary/20 bg-white/50 dark:bg-[#0c1322] shadow-lg shadow-primary/5" : "border-slate-200 dark:border-white/5 opacity-40"} space-y-2`}
    >
      <h5 className="text-[11px] font-black uppercase text-primary tracking-widest">
        {title}
      </h5>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
