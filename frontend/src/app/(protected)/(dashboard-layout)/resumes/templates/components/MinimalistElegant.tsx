"use client";

import { getDisabilityTag } from "@/src/utils/resume";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { CVDataProps } from "../CVTemplates";

export function MinimalistElegantTemplate({
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
  isDemo = false,
  disabilityType,
}: CVDataProps) {
  return (
    <div
      className={`bg-white font-sans h-full w-full flex flex-col justify-between text-slate-800 select-text relative ${
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
        className={`flex-1 flex flex-col justify-between ${isDemo ? "p-4 space-y-3" : "p-10 pt-12 pb-8 space-y-6"}`}
      >
        {/* HEADER: Đã bổ sung khối Avatar tròn đồng bộ */}
        <div className="text-center space-y-2 flex flex-col items-center">
          {/* 🚀 AVATAR PLACEHOLDER MỚI */}
          <div
            className={`bg-indigo-50 border-indigo-200 text-indigo-600 font-black uppercase flex items-center justify-center tracking-tighter rounded-full shadow-md ${
              isDemo
                ? "w-12 h-12 text-xs border"
                : "w-24 h-24 text-3xl border-2 mb-1"
            }`}
          >
            {fullName ? fullName.charAt(0) : "P"}
          </div>

          <h1
            className={`font-black uppercase tracking-wide text-slate-900 ${isDemo ? "text-sm" : "text-3xl font-extrabold"}`}
          >
            {fullName}
          </h1>
          <p
            className={`font-bold text-indigo-600 uppercase tracking-widest ${isDemo ? "text-[5.5px]" : "text-xs font-semibold"}`}
          >
            {jobTitle}
          </p>
          <div className="w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500 to-transparent my-2" />
          <div
            className={`flex justify-center items-center flex-wrap font-medium text-slate-500 ${isDemo ? "gap-2 text-[4.5px]" : "gap-5 text-xs"}`}
          >
            <p className="flex items-center gap-1">
              <Phone size={isDemo ? 4 : 11} className="text-indigo-500" />{" "}
              {phone}
            </p>
            <p className="flex items-center gap-1">
              <Mail size={isDemo ? 4 : 11} className="text-indigo-500" />{" "}
              {email}
            </p>
            <p className="flex items-center gap-1">
              <MapPin size={isDemo ? 4 : 11} className="text-indigo-500" />{" "}
              {address}
            </p>
            <p className="flex items-center gap-1">
              <Globe size={isDemo ? 4 : 11} className="text-indigo-500" />{" "}
              github.com/phongdev
            </p>
          </div>
        </div>

        {/* THÂN 1 CỘT */}
        <div
          className={`flex-1 flex flex-col justify-between ${isDemo ? "space-y-3" : "space-y-5"}`}
        >
          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
            >
              About Me
            </h2>
            <div className="w-full h-px bg-slate-200/80" />
            <p
              className={`text-slate-600 text-justify font-medium leading-relaxed ${isDemo ? "text-[4.8px]" : "text-xs"}`}
            >
              {summary}
            </p>
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
            >
              Experience
            </h2>
            <div className="w-full h-px bg-slate-200/80" />
            <div className="flex justify-between items-baseline font-bold text-slate-900">
              <span
                className={isDemo ? "text-[5.5px]" : "text-xs font-extrabold"}
              >
                Dev Intern | Novaha Lab Unit
              </span>
              <span className="text-slate-400 font-bold text-[9px] isDemo:text-[3.5px]">
                2026 - PRESENT
              </span>
            </div>
            <ul
              className={`list-none text-slate-600 font-medium text-justify ${isDemo ? "space-y-0.5 mt-0.5 text-[4.5px]" : "space-y-2 mt-2 text-xs"}`}
            >
              {experienceBullets?.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 leading-relaxed"
                >
                  <span className="text-indigo-500 mt-1.5 shrink-0">▪</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
            >
              Key Projects
            </h2>
            <div className="w-full h-px bg-slate-200/80" />
            {projects?.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <p
                  className={`font-extrabold text-slate-900 ${isDemo ? "text-[5.5px]" : "text-xs"}`}
                >
                  {proj.name}
                </p>
                <p
                  className={`text-indigo-600 font-bold ${isDemo ? "text-[4.5px]" : "text-[11px]"}`}
                >
                  Techstack: {proj.tech}
                </p>
                <p
                  className={`text-slate-500 font-medium text-justify leading-relaxed ${isDemo ? "text-[4.5px]" : "text-xs"}`}
                >
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
            >
              Education
            </h2>
            <div className="w-full h-px bg-slate-200/80" />
            {education?.map((edu, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start text-slate-600 font-medium"
              >
                <div className={isDemo ? "text-[5px]" : "text-xs"}>
                  <p className="font-extrabold text-slate-900">{edu.school}</p>
                  <p className="text-slate-500 font-semibold">{edu.major}</p>
                </div>
                <span className="text-slate-400 font-bold text-[9px] isDemo:text-[3.5px]">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h2
                className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
              >
                Skills
              </h2>
              <div className="w-full h-px bg-slate-200/80" />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills?.map((skill, index) => (
                  <span
                    key={index}
                    className={`bg-slate-50 text-slate-700 font-semibold rounded-md border border-slate-200/60 ${isDemo ? "text-[4px] px-1 py-0.5" : "text-[11px] px-2 py-1"}`}
                  >
                    {skill.name} ({skill.level}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <h2
                className={`font-black uppercase text-slate-900 tracking-wider ${isDemo ? "text-[6px]" : "text-xs font-bold"}`}
              >
                Certifications
              </h2>
              <div className="w-full h-px bg-slate-200/80" />
              <ul
                className={`list-none text-slate-600 font-medium ${isDemo ? "space-y-0.5 text-[4.5px]" : "space-y-1 text-xs"}`}
              >
                {certifications?.map((cert, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <span className="truncate">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-400 font-bold">
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
          <div
            className={isDemo ? "text-[3.5px]" : "text-[10px] tracking-wider"}
          >
            EQUITAS RESUME STUDIO
          </div>
        </div>
      </div>
    </div>
  );
}
