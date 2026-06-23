"use client";

import { authService } from "@/src/services/authService";
import { useEffect, useState } from "react";

import CandidateInfoBento from "@/src/components/sections/profile/CandidateInfoBento";
import EmployerInfoBento from "@/src/components/sections/profile/EmployerInfoBento";
import ProfileBannerAlert from "@/src/components/sections/profile/ProfileBannerAlert";
import ProfileHeroHeader from "@/src/components/sections/profile/ProfileHeroHeader";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileEmpty, setIsProfileEmpty] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data: any = await authService.getProfileMe();
        if (!data) {
          setIsProfileEmpty(true);
          return;
        }

        const userRole = data?.role?.name || data?.role || null;
        setRole(userRole);
        setProfile(data);

        if (userRole === "Candidate") {
          const cp = data?.candidateProfile;
          if (!cp || !cp.dob || !cp.phone || !cp.address)
            setIsProfileEmpty(true);
        } else if (userRole === "Employer" || userRole === "EMPLOYER") {
          const ep = data?.employerProfile;
          if (!ep || !ep.companyName || !ep.taxCode) setIsProfileEmpty(true);
        }
      } catch (error) {
        console.error("Lỗi đồng bộ hồ sơ:", error);
        setIsProfileEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase animate-pulse">
            Đang nạp cấu trúc...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300 bg-white dark:bg-secondary min-h-screen py-16 px-4 sm:px-6 lg:px-8 selection:bg-primary/20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 1. BANNER CẢNH BÁO HOÀN THIỆN */}
        {isProfileEmpty && <ProfileBannerAlert />}

        {/* 2. HERO HEADER */}
        <ProfileHeroHeader profile={profile} />

        {/* 3. HIỂN THỊ ĐIỀU KIỆN BENTO GRID THEO VAI TRÒ */}
        <div className="w-full">
          {role === "Candidate" && <CandidateInfoBento profile={profile} />}
          {(role === "Employer" || role === "EMPLOYER") && (
            <EmployerInfoBento profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
