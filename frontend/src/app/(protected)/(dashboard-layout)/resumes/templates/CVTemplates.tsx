"use client";

import {
  Award,
  Briefcase,
  Code,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

// 🛠️ SỬA LẠI FILE CVTemplates.tsx
export interface CVDataProps {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  summary: string;
  experienceBullets: string[];
  education: { school: string; major: string; year: string }[];
  skills: { name: string; level: number }[];
  // 🚀 Thêm dấu hỏi chấm (?) vào sau để biến chúng thành thuộc tính tùy chọn (Optional)
  projects?: { name: string; tech: string; desc: string }[];
  certifications?: string[];
  awards?: string[];
  isDemo?: boolean;
}

export function CreativeWaveTemplate({
  fullName,
  email,
  phone,
  address,
  jobTitle,
  summary,
  experienceBullets,
  education,
  skills,
  projects,
  certifications,
  awards,
  isDemo = false,
}: CVDataProps) {
  return (
    <div
      className={`bg-[#F8FAFC] font-sans h-full w-full flex text-slate-800 select-text relative ${
        isDemo
          ? "text-[6px] p-0 select-none pointer-events-none"
          : "text-sm shadow-2xl"
      }`}
      style={{
        width: isDemo ? "100%" : "794px",
        height: isDemo ? "100%" : "1123px",
        minHeight: isDemo ? "100%" : "1123px",
        maxHeight: isDemo ? "100%" : "1123px",
      }}
    >
      {/* =========================================================================
          🌑 CỘT TRÁI (SIDEBAR): Màu Đen Anthracite (#111827) sang trọng, chiếm cứng 35%
          ========================================================================= */}
      <div
        className={`bg-[#111827] text-slate-200 flex flex-col justify-between shrink-0 ${isDemo ? "w-[35%] p-3" : "w-[35%] p-6 pt-12 pb-8"}`}
      >
        <div className={isDemo ? "space-y-4" : "space-y-8"}>
          {/* Vùng Avatar bo góc khối Canvas hiện đại */}
          <div className="flex flex-col items-center">
            <div
              className={`bg-[#1F2937] border-cyan-500/50 text-cyan-400 font-black uppercase flex items-center justify-center tracking-tighter rounded-2xl shadow-xl ${
                isDemo
                  ? "w-16 h-16 text-sm border"
                  : "w-32 h-32 text-4xl border-2"
              }`}
            >
              {fullName ? fullName.charAt(0) : "P"}
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-2">
            <h3
              className={`font-black uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5 ${isDemo ? "text-[6px]" : "text-xs tracking-widest"}`}
            >
              Thông tin cá nhân
            </h3>
            <div
              className={`font-medium text-slate-300 ${isDemo ? "space-y-1 text-[5px]" : "space-y-3 text-xs"}`}
            >
              <p className="flex items-center gap-2.5">
                <Phone
                  size={isDemo ? 5 : 12}
                  className="text-cyan-400 shrink-0"
                />{" "}
                <span className="truncate">{phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail
                  size={isDemo ? 5 : 12}
                  className="text-cyan-400 shrink-0"
                />{" "}
                <span className="truncate">{email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin
                  size={isDemo ? 5 : 12}
                  className="text-cyan-400 shrink-0"
                />{" "}
                <span className="line-clamp-1">{address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Globe
                  size={isDemo ? 5 : 12}
                  className="text-cyan-400 shrink-0"
                />{" "}
                <span className="truncate">github.com/phongdev</span>
              </p>
            </div>
          </div>

          {/* EXPERTISE SKILLS: Thiết kế thanh ngang mảnh nét đứt cực sang */}
          <div className="space-y-2">
            <h3
              className={`font-black uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5 ${isDemo ? "text-[6px]" : "text-xs tracking-widest"}`}
            >
              Expertise
            </h3>
            <div className={isDemo ? "space-y-1.5" : "space-y-4"}>
              {skills?.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex justify-between font-semibold text-slate-300 ${isDemo ? "text-[5.5px]" : "text-xs"}`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-cyan-400 font-bold">
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    className={`bg-[#1F2937] rounded-full overflow-hidden w-full ${isDemo ? "h-0.5" : "h-1"}`}
                  >
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="space-y-2">
            <h3
              className={`font-black uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5 ${isDemo ? "text-[6px]" : "text-xs tracking-widest"}`}
            >
              Certifications
            </h3>
            <ul
              className={`font-semibold text-slate-300 ${isDemo ? "space-y-1 text-[5px]" : "space-y-3 text-xs"}`}
            >
              {certifications?.map((cert, index) => (
                <li
                  key={index}
                  className="flex items-start gap-1.5 leading-tight"
                >
                  <span className="text-cyan-400 shrink-0">▪</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Khối Trợ Năng Độc Quyền (Accessibility Tags) ép cố định đáy Sidebar */}
        <div
          className={`bg-[#1F2937]/50 border border-slate-800 rounded-xl ${isDemo ? "p-1.5 space-y-0.5" : "p-3 space-y-1.5"}`}
        >
          <h4
            className={`font-black uppercase text-emerald-400 ${isDemo ? "text-[4.5px]" : "text-[9px] tracking-wider"}`}
          >
            EQUITAS UTILITIES
          </h4>
          <div className="flex flex-wrap gap-1">
            <span
              className={`bg-emerald-950/60 text-emerald-400 font-bold rounded ${isDemo ? "text-[4px] px-1 py-0.5" : "text-[9px] px-2 py-0.5"}`}
            >
              ♿ Wheelchair
            </span>
            <span
              className={`bg-emerald-950/60 text-emerald-400 font-bold rounded ${isDemo ? "text-[4px] px-1 py-0.5" : "text-[9px] px-2 py-0.5"}`}
            >
              👁️ Screen Reader
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ⚪ CỘT PHẢI (MAIN CONTENT): Chiếm 65% diện tích, căn chỉnh giãn biên cực thoáng
          ========================================================================= */}
      <div
        className={`bg-white flex flex-col ${isDemo ? "w-[65%] p-4" : "w-[65%] p-9 pt-12 pb-10"}`}
      >
        {/* KHỐI ĐỊNH DANH (HEADER) */}
        <div
          className={`border-b border-slate-100 ${isDemo ? "pb-2 mb-3" : "pb-5 mb-6"}`}
        >
          <h1
            className={`font-black uppercase tracking-tight text-slate-900 ${isDemo ? "text-sm" : "text-3xl font-black tracking-tight text-slate-900"}`}
          >
            {fullName || "NGUYỄN TUÂN PHONG"}
          </h1>
          <p
            className={`font-extrabold text-cyan-600 uppercase tracking-widest ${isDemo ? "text-[5.5px] mt-0.5" : "text-xs font-bold mt-1.5"}`}
          >
            {jobTitle || "FULL-STACK DEVELOPER"}
          </p>
        </div>

        {/* KHỐI NỘI DUNG CHÍNH: Tăng cường space-y lớp bọc để tự động lấp đầy khoảng trống tự nhiên */}
        <div
          className={`flex-1 flex flex-col justify-between ${isDemo ? "space-y-3" : "space-y-6"}`}
        >
          {/* PROFILE SUMMARY */}
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`font-black uppercase text-slate-900 flex items-center gap-2 ${isDemo ? "text-[6.5px]" : "text-xs tracking-wider"}`}
            >
              <User size={isDemo ? 5 : 12} className="text-cyan-600 shrink-0" />{" "}
              Profile Summary
            </h2>
            <div className="w-full h-[1px] bg-slate-100" />
            <p
              className={`text-slate-600 text-justify font-medium leading-relaxed ${isDemo ? "text-[5px]" : "text-xs text-slate-600/90 pl-0.5"}`}
            >
              {summary}
            </p>
          </div>

          {/* WORK EXPERIENCE */}
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`font-black uppercase text-slate-900 flex items-center gap-2 ${isDemo ? "text-[6.5px]" : "text-xs tracking-wider"}`}
            >
              <Briefcase
                size={isDemo ? 5 : 12}
                className="text-cyan-600 shrink-0"
              />{" "}
              Work Experience
            </h2>
            <div className="w-full h-[1px] bg-slate-100" />
            <div className="pl-0.5 mt-2">
              <div className="flex justify-between items-baseline font-bold text-slate-800">
                <span
                  className={
                    isDemo
                      ? "text-[5.5px]"
                      : "text-xs font-extrabold text-slate-800"
                  }
                >
                  Dev Intern | Novaha Lab Unit
                </span>
                <span className="text-slate-400 font-bold text-[9px] isDemo:text-[3.5px]">
                  03/2026 - Present
                </span>
              </div>
              <ul
                className={`list-none text-slate-600 font-medium text-justify ${isDemo ? "space-y-1 mt-1 text-[4.5px]" : "space-y-3 mt-3 text-xs text-slate-600/90"}`}
              >
                {experienceBullets?.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 leading-relaxed"
                  >
                    <span className="text-cyan-500 mt-1.5 shrink-0">▪</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KEY TECHNICAL PROJECTS */}
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`font-black uppercase text-slate-900 flex items-center gap-2 ${isDemo ? "text-[6.5px]" : "text-xs tracking-wider"}`}
            >
              <Code size={isDemo ? 5 : 12} className="text-cyan-600 shrink-0" />{" "}
              Key Technical Projects
            </h2>
            <div className="w-full h-[1px] bg-slate-100" />
            <div
              className={
                isDemo ? "space-y-1 mt-1 pl-0.5" : "space-y-3.5 mt-2 pl-0.5"
              }
            >
              {projects?.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <p
                    className={`font-extrabold text-slate-800 ${isDemo ? "text-[5.5px]" : "text-xs font-black text-slate-900"}`}
                  >
                    {proj.name}
                  </p>
                  <p
                    className={`text-cyan-600 font-bold ${isDemo ? "text-[4.5px]" : "text-[11px]"}`}
                  >
                    Techstack: {proj.tech}
                  </p>
                  <p
                    className={`text-slate-500 font-medium text-justify leading-relaxed ${isDemo ? "text-[4.5px]" : "text-xs text-slate-500/90"}`}
                  >
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION HISTORY */}
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`font-black uppercase text-slate-900 flex items-center gap-2 ${isDemo ? "text-[6.5px]" : "text-xs tracking-wider"}`}
            >
              <GraduationCap
                size={isDemo ? 5 : 12}
                className="text-cyan-600 shrink-0"
              />{" "}
              Education History
            </h2>
            <div className="w-full h-[1px] bg-slate-100" />
            <div
              className={
                isDemo ? "space-y-1 mt-1 pl-0.5" : "space-y-3 mt-2 pl-0.5"
              }
            >
              {education?.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start text-slate-600 font-medium"
                >
                  <div className={isDemo ? "text-[5px]" : "text-xs"}>
                    <p className="font-extrabold text-slate-900">
                      {edu.school}
                    </p>
                    <p className="text-slate-500 font-semibold">{edu.major}</p>
                  </div>
                  <span className="text-slate-400 font-bold text-[9px] isDemo:text-[3.5px]">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HONORS & AWARDS */}
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`font-black uppercase text-slate-900 flex items-center gap-2 ${isDemo ? "text-[6.5px]" : "text-xs tracking-wider"}`}
            >
              <Award
                size={isDemo ? 5 : 12}
                className="text-cyan-600 shrink-0"
              />{" "}
              Honors & Awards
            </h2>
            <div className="w-full h-[1px] bg-slate-100" />
            <ul
              className={`list-none text-slate-600 font-medium ${isDemo ? "space-y-0.5 pl-0.5 text-[5px]" : "space-y-2 pl-0.5 text-xs mt-2"}`}
            >
              {awards?.map((award, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CHÂN TRANG ĐỒ HỌA HỌC THUẬT */}
        <div
          className={`text-center border-t border-slate-100 pt-3 text-slate-400 font-bold tracking-wider ${isDemo ? "text-[3.5px] mt-2" : "text-[10px] mt-4"}`}
        >
          POWERED BY EQUITAS AI RESUME ENGINE
        </div>
      </div>
    </div>
  );
}

export const AVAILABLE_TEMPLATES = [
  {
    id: "template-canva-creative-1",
    name: "Mẫu Canva Đen Trắng Giãn Đều",
    Component: CreativeWaveTemplate,
  },
];
