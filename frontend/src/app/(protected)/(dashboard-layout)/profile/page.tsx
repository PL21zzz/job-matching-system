"use client";

import api from "@/src/lib/axios";
import {
  Accessibility,
  Building2,
  Calendar,
  Edit3,
  FileText,
  MapPin,
  Phone,
  Share2,
  ShieldAlert,
  ShieldCheck,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase animate-pulse">
          Đang đồng bộ cấu trúc Bento...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <p className="text-sm font-black text-red-500 uppercase tracking-widest">
          Không tìm thấy thực thể người dùng.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary text-slate-900 dark:text-white py-12 transition-colors duration-300 selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ================= 1. ALERT BANNER XÁC THỰC (NHƯ MOCKUP) ================= */}
        {isProfileEmpty && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex gap-3 items-center">
              <ShieldAlert className="text-amber-500 shrink-0" size={18} />
              <div>
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Hồ sơ của sếp chưa hoàn thiện!
                </h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-amber-500/60 mt-0.5">
                  Vui lòng cập nhật đầy đủ thông tin chi tiết để hệ thống AI bắt
                  đầu kết nối việc làm chính xác nhé.
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white dark:text-secondary text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 active:scale-95"
            >
              Điền hồ sơ ngay
            </Link>
          </div>
        )}

        {/* ================= 2. HERO AVATAR BOX (Y HỆT STITCH MOCKUP) ================= */}
        <div className="p-8 rounded-[1.5rem] bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
          {/* Avatar Khối tròn viền sáng */}
          <div className="relative shrink-0 w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-primary to-purple-500/40 shadow-inner">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center text-3xl font-black text-primary uppercase">
              {profile.fullName?.charAt(0) || "U"}
            </div>
            <div className="absolute bottom-0 right-0 bg-white dark:bg-surface p-1 rounded-full shadow-md border border-slate-200 dark:border-border-subtle">
              <ShieldCheck size={14} className="text-primary" />
            </div>
          </div>

          {/* Info & Cụm nút */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <h1 className="text-xl font-black tracking-wide uppercase text-slate-900 dark:text-white">
              {profile.fullName || "HỒ BẢO TRUNG"}
            </h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {profile.email}
            </p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
              <Link
                href="/profile/edit"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white dark:text-secondary text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
              >
                <Edit3 size={12} /> Chỉnh sửa profile
              </Link>
              <button className="px-4 py-2 rounded-xl bg-white dark:bg-secondary hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-border-subtle flex items-center gap-1.5">
                <Share2 size={12} /> Chia sẻ
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3. KHỐI THÔNG TIN CÁ NHÂN (BENTO GRID 3 CỘT) ================= */}
        <div className="space-y-4">
          <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-primary/60">
            Thông tin cá nhân
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box Ngày sinh */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Calendar size={13} className="text-primary" /> Ngày sinh
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile.candidateProfile?.dob
                  ? new Date(profile.candidateProfile.dob).toLocaleDateString(
                      "vi-VN",
                    )
                  : "15/05/1995"}
              </p>
            </div>

            {/* Box Số điện thoại */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Phone size={13} className="text-primary" /> Số điện thoại
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile.candidateProfile?.phone || "+84 905 123 456"}
              </p>
            </div>

            {/* Box Xác thực */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <ShieldCheck size={13} className="text-primary" /> Trạng thái
                xác thực
              </div>
              <p className="text-sm font-bold text-[#25b5ba]">Đã xác minh</p>
            </div>

            {/* Box Địa chỉ (Hàng dài full width) */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm md:col-span-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <MapPin size={13} className="text-primary" /> Địa chỉ cư trú
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                {profile.candidateProfile?.address ||
                  "221B Baker Street, District 1, Ho Chi Minh City, Vietnam"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= 4. KHỐI THÔNG TIN DOANH NGHIỆP (BENTO GRID 2 CỘT) ================= */}
        <div className="space-y-4">
          <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-primary/60">
            Thông tin doanh nghiệp
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Tên công ty */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Building2 size={13} className="text-primary" /> Tên công ty
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile.employerProfile?.companyName ||
                  "Equitas AI Technologies J.S.C"}
              </p>
            </div>

            {/* Box Mã số thuế */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <FileText size={13} className="text-primary" /> Mã số thuế
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile.employerProfile?.taxCode || "0316543210"}
              </p>
            </div>

            {/* Box Địa chỉ văn phòng (Full width) */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm md:col-span-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <MapPin size={13} className="text-primary" /> Địa chỉ văn phòng
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile.employerProfile?.address ||
                  "Tòa nhà Landmark 81, Vinhomes Central Park, Phường 22, Quận Bình Thạnh, TP.HCM"}
              </p>
            </div>

            {/* Box Mô tả doanh nghiệp (Full width) */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle space-y-2 shadow-sm md:col-span-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <FileText size={13} className="text-primary" /> Mô tả doanh
                nghiệp
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {profile.employerProfile?.description || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= 5. HẠ TẦNG TRỢ NĂNG (ĐỘC QUYỀN TRÊN MOCKUP STITCH) ================= */}
        <div className="p-6 md:p-8 rounded-[1.5rem] border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest">
            <Accessibility size={15} /> Hạ tầng trợ năng hỗ trợ người khuyết tật
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lối đi xe lăn */}
            <div className="p-5 rounded-xl bg-white/40 dark:bg-[#0c1322] border border-slate-200 dark:border-white/5 space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-primary tracking-wide">
                Lối đi xe lăn
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {role === "Employer" &&
                profile.employerProfile?.accessibilityFeatures
                  ? profile.employerProfile.accessibilityFeatures
                  : "Sẵn có tại sảnh chính và các tầng văn phòng làm việc."}
              </p>
            </div>

            {/* Hỗ trợ khiếm thính */}
            <div className="p-5 rounded-xl bg-white/40 dark:bg-[#0c1322] border border-slate-200 dark:border-white/5 space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-primary tracking-wide">
                Hỗ trợ khiếm thính
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Hệ thống phiên dịch ngôn ngữ ký tự ảo tích hợp tại phòng họp
                trung tâm.
              </p>
            </div>

            {/* Phòng vệ sinh trợ năng */}
            <div className="p-5 rounded-xl bg-white/40 dark:bg-[#0c1322] border border-slate-200 dark:border-white/5 space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-primary tracking-wide">
                Phòng vệ sinh trợ năng
              </h5>
              <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium leading-relaxed">
                Chưa cập nhật chi tiết
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
