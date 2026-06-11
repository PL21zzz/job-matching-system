"use client";

import { getDisabilityTag } from "@/src/utils/resume";
import { CVDataProps } from "../CVTemplates";

export function ModernCreativeTemplate({
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
  disabilityType,
}: CVDataProps) {
  return (
    <div
      className={`bg-[#F9F6EE] font-sans h-full w-full flex flex-col justify-between text-slate-800 select-text relative overflow-hidden ${
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
      <div
        className={`w-full bg-linear-to-r from-[#FF007F] to-[#FFB6C1] flex items-center justify-center shrink-0 ${isDemo ? "h-6" : "h-12"}`}
      />

      <div
        className={`text-center shrink-0 bg-[#0A5C43] text-[#F9F6EE] flex flex-col justify-center ${isDemo ? "py-2" : "py-6"}`}
      >
        <h1
          className={`font-black tracking-widest uppercase ${isDemo ? "text-base" : "text-4xl font-extrabold"}`}
        >
          {fullName}
        </h1>
        <p
          className={`font-bold text-[#FF007F] uppercase tracking-widest ${isDemo ? "text-[5.5px] mt-0.5" : "text-xs font-semibold mt-2"}`}
        >
          {jobTitle}
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* THÂN TRÁI (BEIGE) */}
        <div
          className={`w-[60%] flex flex-col justify-between shrink-0 bg-[#F5F2EB] ${isDemo ? "p-3" : "p-7 pt-6 pb-6"}`}
        >
          <div
            className={`flex-1 flex flex-col justify-between ${isDemo ? "space-y-3" : "space-y-5"}`}
          >
            <div className="space-y-1">
              <h2
                className={`font-black uppercase text-[#0A5C43] tracking-tight ${isDemo ? "text-[6.5px]" : "text-sm"}`}
              >
                Xin Chào
              </h2>
              <p
                className={`text-slate-700 text-justify font-semibold leading-relaxed ${isDemo ? "text-[4.8px]" : "text-xs"}`}
              >
                {summary}
              </p>
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase text-[#0A5C43] tracking-tight ${isDemo ? "text-[6.5px]" : "text-sm"}`}
              >
                Kinh Nghiệm
              </h2>
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span
                  className={
                    isDemo
                      ? "text-[5.5px]"
                      : "text-xs font-extrabold text-[#0A5C43]"
                  }
                >
                  Dev Intern | Novaha Lab
                </span>
                <span className="text-slate-400 font-bold text-[8px]">
                  03/2026 - PRESENT
                </span>
              </div>
              <ul
                className={`list-none text-slate-600 font-medium text-justify ${isDemo ? "space-y-0.5 mt-0.5 text-[4.2px]" : "space-y-2 mt-2 text-xs"}`}
              >
                {experienceBullets?.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1 leading-relaxed"
                  >
                    <span className="text-[#FF007F] mt-1.5 shrink-0">✦</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase text-[#0A5C43] tracking-tight ${isDemo ? "text-[6.5px]" : "text-sm"}`}
              >
                Dự Án Trọng Tâm
              </h2>
              {projects?.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p
                    className={`font-extrabold text-slate-900 ${isDemo ? "text-[5.5px]" : "text-xs"}`}
                  >
                    {proj.name}
                  </p>
                  <p
                    className={`text-[#FF007F] font-bold ${isDemo ? "text-[4.5px]" : "text-[11px]"}`}
                  >
                    Tech: {proj.tech}
                  </p>
                  <p
                    className={`text-slate-600 font-medium text-justify leading-relaxed ${isDemo ? "text-[4.5px]" : "text-xs"}`}
                  >
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase text-[#0A5C43] tracking-tight ${isDemo ? "text-[6.5px]" : "text-sm"}`}
              >
                Học Vấn
              </h2>
              {education?.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start text-slate-600 font-medium"
                >
                  <div className={isDemo ? "text-[5px]" : "text-xs"}>
                    <p className="font-extrabold text-slate-900">
                      {edu.school}
                    </p>
                  </div>
                  <span className="text-slate-400 font-bold text-[8px]">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THÂN PHẢI (GREEN SIDEBAR) */}
        <div
          className={`w-[40%] bg-[#0A5C43] text-[#F9F6EE] flex flex-col justify-between shrink-0 relative ${isDemo ? "p-3" : "p-6 pt-6 pb-6"}`}
        >
          <div className={isDemo ? "space-y-3" : "space-y-6"}>
            {/* 🚀 ĐÃ BỔ SUNG: KHỐI AVATAR TRONG SIDEBAR PHẢI */}
            <div className="flex flex-col items-center mb-2">
              <div
                className={`bg-[#147358] border-[#FF007F]/60 text-[#FF007F] font-black uppercase flex items-center justify-center tracking-tighter rounded-full shadow-lg ${
                  isDemo
                    ? "w-12 h-12 text-xs border"
                    : "w-24 h-24 text-3xl border-2 border-dashed"
                }`}
              >
                {fullName ? fullName.charAt(0) : "P"}
              </div>
            </div>

            <div className="space-y-2">
              <h3
                className={`font-black uppercase tracking-wider text-[#FF007F] border-b border-[#147358] pb-1 ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
              >
                Kỹ Năng
              </h3>
              {skills?.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex justify-between font-semibold text-[#F9F6EE] ${isDemo ? "text-[5.5px]" : "text-xs"}`}
                  >
                    <span>{skill.name}</span>
                  </div>
                  <div
                    className={`bg-[#147358] rounded-full overflow-hidden w-full ${isDemo ? "h-1" : "h-1.5"}`}
                  >
                    <div
                      className="bg-[#FF007F] h-full rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3
                className={`font-black uppercase tracking-wider text-[#FF007F] border-b border-[#147358] pb-1 ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
              >
                Thành Tựu
              </h3>
              <ul
                className={`font-semibold text-slate-200 ${isDemo ? "space-y-1 text-[4.8px]" : "space-y-2.5 text-xs text-slate-100/90"}`}
              >
                {awards?.map((award, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-[#FF007F] shrink-0">★</span>
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h3
              className={`font-black uppercase tracking-wider text-[#FF007F] border-b border-[#147358] pb-1 ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
            >
              Liên Hệ
            </h3>
            <div
              className={`font-semibold text-slate-200 ${isDemo ? "space-y-1 text-[4.5px]" : "space-y-2 text-xs"}`}
            >
              <p className="truncate">📞 {phone}</p>
              <p className="truncate">✉️ {email}</p>
              <p className="line-clamp-1">📍 {address}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bg-linear-to-r from-[#FFB6C1] to-[#FF007F] flex items-center justify-between shrink-0 font-bold text-slate-900 ${isDemo ? "h-4 px-2 text-[3.5px]" : "h-9 px-6 text-[10px]"}`}
      >
        {disabilityType && (
          <div
            className={`bg-[#1F2937]/50 border border-slate-800 rounded-xl ${isDemo ? "p-1.5 space-y-0.5" : "p-3 space-y-1.5"}`}
          >
            <h4
              className={`font-black uppercase text-emerald-400 ${isDemo ? "text-[4.5px]" : "text-[9px] tracking-wider"}`}
            >
              EQUITAS UTILITIES
            </h4>
            <div className="flex flex-wrap gap-1">
              {(() => {
                const tag = getDisabilityTag(disabilityType);
                if (!tag) return null;
                return (
                  <span
                    className={`bg-emerald-950/60 text-emerald-400 font-bold rounded flex items-center gap-1 ${
                      isDemo
                        ? "text-[4px] px-1 py-0.5"
                        : "text-[9px] px-2 py-0.5"
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </span>
                );
              })()}
            </div>
          </div>
        )}
        <div className="tracking-widest uppercase text-white font-black">
          EQUITAS RETRO ENGINE
        </div>
      </div>
    </div>
  );
}
