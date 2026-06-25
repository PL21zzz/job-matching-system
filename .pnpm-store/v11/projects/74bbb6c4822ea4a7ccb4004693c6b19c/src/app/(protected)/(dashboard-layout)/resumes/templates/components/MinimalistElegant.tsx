"use client";

import {
  InlineInput,
  InlineTextarea,
} from "../../editor/components/InlineEditable";
import { getDisabilityTag } from "@/src/utils/resume";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { CVDataProps } from "../CVTemplates";

export function MinimalistElegantTemplate({
  fullName,
  email,
  phone,
  address,
  portfolioUrl,
  jobTitle,
  summary,
  experienceTitle,
  experienceCompany,
  experienceDuration,
  experienceBullets,
  education,
  skills,
  projects,
  certifications,
  isDemo = false,
  disabilityType,
  editable = false,
  onFieldChange,
  onBulletChange,
  onProjectChange,
  onEduChange,
  onSkillChange,
  onCertChange,
}: CVDataProps) {
  const showPortfolio = !!portfolioUrl?.trim();

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between bg-white font-sans text-slate-800 ${
        isDemo
          ? "select-none p-0 text-[6px] pointer-events-none"
          : "select-text shadow-2xl text-sm"
      }`}
      style={{
        width: isDemo ? "100%" : "794px",
        height: isDemo ? "100%" : "1123px",
        minHeight: isDemo ? "100%" : "1123px",
        maxHeight: isDemo ? "100%" : "1123px",
      }}
    >
      <div
        className={`flex flex-1 flex-col justify-between ${
          isDemo ? "space-y-3 p-4" : "space-y-6 p-10 pb-8 pt-12"
        }`}
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <div
            className={`flex items-center justify-center rounded-full border text-indigo-600 shadow-md uppercase font-black tracking-tighter ${
              isDemo
                ? "h-12 w-12 border-indigo-200 bg-indigo-50 text-xs"
                : "mb-1 h-24 w-24 border-2 border-indigo-200 bg-indigo-50 text-3xl"
            }`}
          >
            {fullName ? fullName.charAt(0) : "U"}
          </div>

          <InlineInput
            value={fullName}
            onChange={(value) => onFieldChange?.("fullName", value)}
            disabled={!editable}
            placeholder="Họ và tên"
            className={`text-center font-black uppercase tracking-wide text-slate-900 ${
              isDemo ? "text-sm" : "text-3xl font-extrabold"
            }`}
          />

          <InlineInput
            value={jobTitle}
            onChange={(value) => onFieldChange?.("jobTitle", value)}
            disabled={!editable}
            placeholder="Vị trí ứng tuyển"
            className={`text-center font-bold uppercase tracking-widest text-indigo-600 ${
              isDemo ? "text-[5.5px]" : "text-xs font-semibold"
            }`}
          />

          <div className="my-2 h-0.5 w-full bg-linear-to-r from-transparent via-indigo-500 to-transparent" />

          <div
            className={`flex flex-wrap items-center justify-center font-medium text-slate-500 ${
              isDemo ? "gap-2 text-[4.5px]" : "gap-5 text-xs"
            }`}
          >
            <p className="flex items-center gap-1">
              <Phone size={isDemo ? 4 : 11} className="text-indigo-500" />
              <InlineInput
                value={phone}
                onChange={(value) => onFieldChange?.("phone", value)}
                disabled={!editable}
                placeholder="Số điện thoại"
              />
            </p>
            <p className="flex items-center gap-1">
              <Mail size={isDemo ? 4 : 11} className="text-indigo-500" />
              <InlineInput
                value={email}
                onChange={(value) => onFieldChange?.("email", value)}
                disabled={!editable}
                placeholder="Email"
              />
            </p>
            <p className="flex items-center gap-1">
              <MapPin size={isDemo ? 4 : 11} className="text-indigo-500" />
              <InlineInput
                value={address}
                onChange={(value) => onFieldChange?.("address", value)}
                disabled={!editable}
                placeholder="Địa chỉ"
              />
            </p>
            {showPortfolio && (
              <p className="flex items-center gap-1">
                <Globe size={isDemo ? 4 : 11} className="text-indigo-500" />
                <InlineInput
                  value={portfolioUrl || ""}
                  onChange={(value) => onFieldChange?.("portfolioUrl", value)}
                  disabled={!editable}
                  placeholder="Website / portfolio"
                />
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex flex-1 flex-col justify-between ${
            isDemo ? "space-y-3" : "space-y-5"
          }`}
        >
          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase tracking-wider text-slate-900 ${
                isDemo ? "text-[6px]" : "text-xs font-bold"
              }`}
            >
              Giới thiệu
            </h2>
            <div className="h-px w-full bg-slate-200/80" />
            <InlineTextarea
              value={summary}
              onChange={(value) => onFieldChange?.("summary", value)}
              disabled={!editable}
              rows={3}
              placeholder="Viết một đoạn giới thiệu ngắn, tập trung vào điểm mạnh phù hợp với công việc."
              className={`text-justify font-medium leading-relaxed text-slate-600 ${
                isDemo ? "text-[4.8px]" : "text-xs"
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase tracking-wider text-slate-900 ${
                isDemo ? "text-[6px]" : "text-xs font-bold"
              }`}
            >
              Kinh nghiệm
            </h2>
            <div className="h-px w-full bg-slate-200/80" />
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4 font-bold text-slate-900">
                <InlineInput
                  value={[experienceTitle, experienceCompany]
                    .filter(Boolean)
                    .join(" | ")}
                  onChange={(value) => {
                    const [title, company] = value.split("|").map((item) => item.trim());
                    onFieldChange?.("experienceTitle", title || "");
                    onFieldChange?.("experienceCompany", company || "");
                  }}
                  disabled={!editable}
                  placeholder="Ví dụ: Nhân viên vệ sinh | Công ty ABC"
                  className={isDemo ? "text-[5.5px]" : "text-xs font-extrabold"}
                />
                <InlineInput
                  value={experienceDuration || ""}
                  onChange={(value) => onFieldChange?.("experienceDuration", value)}
                  disabled={!editable}
                  placeholder="Thời gian"
                  className="w-[150px] text-right text-[9px] font-bold text-slate-400"
                />
              </div>

              <ul
                className={`list-none text-justify font-medium text-slate-600 ${
                  isDemo ? "mt-0.5 space-y-0.5 text-[4.5px]" : "mt-2 space-y-2 text-xs"
                }`}
              >
                {experienceBullets?.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="mt-1.5 shrink-0 text-indigo-500">▪</span>
                    <InlineTextarea
                      value={bullet}
                      onChange={(value) => onBulletChange?.(idx, value)}
                      disabled={!editable}
                      placeholder={`Mô tả kinh nghiệm ${idx + 1}`}
                      className={isDemo ? "text-[4.5px]" : "text-xs"}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase tracking-wider text-slate-900 ${
                isDemo ? "text-[6px]" : "text-xs font-bold"
              }`}
            >
              Dự án nổi bật
            </h2>
            <div className="h-px w-full bg-slate-200/80" />
            {projects?.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <InlineInput
                  value={proj.name}
                  onChange={(value) => onProjectChange?.(idx, "name", value)}
                  disabled={!editable}
                  placeholder={`Tên dự án ${idx + 1}`}
                  className={`font-extrabold text-slate-900 ${
                    isDemo ? "text-[5.5px]" : "text-xs"
                  }`}
                />
                <InlineInput
                  value={proj.tech}
                  onChange={(value) => onProjectChange?.(idx, "tech", value)}
                  disabled={!editable}
                  placeholder="Công nghệ / công cụ"
                  className={`font-bold text-indigo-600 ${
                    isDemo ? "text-[4.5px]" : "text-[11px]"
                  }`}
                />
                <InlineTextarea
                  value={proj.desc}
                  onChange={(value) => onProjectChange?.(idx, "desc", value)}
                  disabled={!editable}
                  placeholder="Mô tả ngắn về dự án"
                  className={`text-justify font-medium leading-relaxed text-slate-500 ${
                    isDemo ? "text-[4.5px]" : "text-xs"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <h2
              className={`font-black uppercase tracking-wider text-slate-900 ${
                isDemo ? "text-[6px]" : "text-xs font-bold"
              }`}
            >
              Học vấn
            </h2>
            <div className="h-px w-full bg-slate-200/80" />
            {education?.map((edu, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 font-medium text-slate-600"
              >
                <div className={`space-y-0.5 ${isDemo ? "text-[5px]" : "text-xs"}`}>
                  <InlineInput
                    value={edu.school}
                    onChange={(value) => onEduChange?.(idx, "school", value)}
                    disabled={!editable}
                    placeholder="Tên trường"
                    className="font-extrabold text-slate-900"
                  />
                  <InlineInput
                    value={edu.major}
                    onChange={(value) => onEduChange?.(idx, "major", value)}
                    disabled={!editable}
                    placeholder="Ngành học"
                    className="font-semibold text-slate-500"
                  />
                </div>
                <InlineInput
                  value={edu.year}
                  onChange={(value) => onEduChange?.(idx, "year", value)}
                  disabled={!editable}
                  placeholder="2022 - 2026"
                  className="w-[110px] text-right text-[9px] font-bold text-slate-400"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h2
                className={`font-black uppercase tracking-wider text-slate-900 ${
                  isDemo ? "text-[6px]" : "text-xs font-bold"
                }`}
              >
                Kỹ năng
              </h2>
              <div className="h-px w-full bg-slate-200/80" />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills?.map((skill, index) => (
                  <span
                    key={index}
                    className={`rounded-md border border-slate-200/60 bg-slate-50 text-slate-700 ${
                      isDemo ? "px-1 py-0.5 text-[4px]" : "px-2 py-1 text-[11px]"
                    }`}
                  >
                    <InlineInput
                      value={skill.name}
                      onChange={(value) => onSkillChange?.(index, "name", value)}
                      disabled={!editable}
                      placeholder={`Kỹ năng ${index + 1}`}
                      className="text-center font-semibold"
                    />
                    <span className="font-bold"> ({skill.level}%)</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <h2
                className={`font-black uppercase tracking-wider text-slate-900 ${
                  isDemo ? "text-[6px]" : "text-xs font-bold"
                }`}
              >
                Chứng chỉ
              </h2>
              <div className="h-px w-full bg-slate-200/80" />
              <ul
                className={`list-none font-medium text-slate-600 ${
                  isDemo ? "space-y-0.5 text-[4.5px]" : "space-y-1 text-xs"
                }`}
              >
                {certifications?.map((cert, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <InlineInput
                      value={cert}
                      onChange={(value) => onCertChange?.(index, value)}
                      disabled={!editable}
                      placeholder={`Chứng chỉ ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 font-bold text-slate-400">
          {disabilityType && (
            <div
              className={`rounded-xl border border-slate-800 bg-[#1F2937]/50 ${
                isDemo ? "space-y-0.5 p-1.5" : "space-y-1.5 p-3"
              }`}
            >
              <h4
                className={`font-black uppercase text-emerald-400 ${
                  isDemo ? "text-[4.5px]" : "text-[9px] tracking-wider"
                }`}
              >
                EQUITAS UTILITIES
              </h4>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const tag = getDisabilityTag(disabilityType);
                  if (!tag) return null;
                  return (
                    <span
                      className={`flex items-center gap-1 rounded bg-emerald-950/60 font-bold text-emerald-400 ${
                        isDemo ? "px-1 py-0.5 text-[4px]" : "px-2 py-0.5 text-[9px]"
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
          <div className={isDemo ? "text-[3.5px]" : "text-[10px] tracking-wider"}>
            EQUITAS RESUME STUDIO
          </div>
        </div>
      </div>
    </div>
  );
}
