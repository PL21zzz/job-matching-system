"use client";

import {
  InlineInput,
  InlineTextarea,
} from "../../editor/components/InlineEditable";
import { getDisabilityTag } from "@/src/utils/resume";
import { CVDataProps } from "../CVTemplates";

export function ModernCreativeTemplate({
  fullName,
  email,
  phone,
  address,
  jobTitle,
  summary,
  experienceTitle,
  experienceCompany,
  experienceDuration,
  experienceBullets,
  education,
  skills,
  projects,
  awards,
  isDemo = false,
  disabilityType,
  editable = false,
  onFieldChange,
  onBulletChange,
  onProjectChange,
  onEduChange,
  onSkillChange,
  onAwardChange,
}: CVDataProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#F9F6EE] font-sans text-slate-800 ${
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
        className={`h-12 w-full shrink-0 bg-linear-to-r from-[#FF007F] to-[#FFB6C1] ${
          isDemo ? "h-6" : "h-12"
        }`}
      />

      <div
        className={`flex shrink-0 flex-col justify-center bg-[#0A5C43] text-[#F9F6EE] text-center ${
          isDemo ? "py-2" : "py-6"
        }`}
      >
        <InlineInput
          value={fullName}
          onChange={(value) => onFieldChange?.("fullName", value)}
          disabled={!editable}
          placeholder="Họ và tên"
          className={`text-center font-black uppercase tracking-widest ${
            isDemo ? "text-base" : "text-4xl font-extrabold"
          }`}
        />
        <InlineInput
          value={jobTitle}
          onChange={(value) => onFieldChange?.("jobTitle", value)}
          disabled={!editable}
          placeholder="Vị trí ứng tuyển"
          className={`mt-2 text-center font-bold uppercase tracking-widest text-[#FF007F] ${
            isDemo ? "text-[5.5px]" : "text-xs font-semibold"
          }`}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-[60%] shrink-0 bg-[#F5F2EB] ${
            isDemo ? "p-3" : "p-7 pb-6 pt-6"
          }`}
        >
          <div
            className={`flex h-full flex-col justify-between ${
              isDemo ? "space-y-3" : "space-y-5"
            }`}
          >
            <div className="space-y-1">
              <h2
                className={`font-black uppercase tracking-tight text-[#0A5C43] ${
                  isDemo ? "text-[6.5px]" : "text-sm"
                }`}
              >
                Giới thiệu
              </h2>
              <InlineTextarea
                value={summary}
                onChange={(value) => onFieldChange?.("summary", value)}
                disabled={!editable}
                rows={3}
                placeholder="Tóm tắt ngắn về năng lực và mức độ phù hợp với công việc."
                className={`text-justify font-semibold leading-relaxed text-slate-700 ${
                  isDemo ? "text-[4.8px]" : "text-xs"
                }`}
              />
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase tracking-tight text-[#0A5C43] ${
                  isDemo ? "text-[6.5px]" : "text-sm"
                }`}
              >
                Kinh nghiệm
              </h2>
              <div className="flex items-baseline justify-between gap-3 font-bold text-slate-900">
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
                  placeholder="Ví dụ: Nhân viên hỗ trợ | Công ty ABC"
                  className={isDemo ? "text-[5.5px]" : "text-xs font-extrabold text-[#0A5C43]"}
                />
                <InlineInput
                  value={experienceDuration || ""}
                  onChange={(value) => onFieldChange?.("experienceDuration", value)}
                  disabled={!editable}
                  placeholder="Thời gian"
                  className="w-[150px] text-right text-[8px] font-bold text-slate-400"
                />
              </div>
              <ul
                className={`list-none text-justify font-medium text-slate-600 ${
                  isDemo ? "mt-0.5 space-y-0.5 text-[4.2px]" : "mt-2 space-y-2 text-xs"
                }`}
              >
                {experienceBullets?.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1 leading-relaxed">
                    <span className="mt-1.5 shrink-0 text-[#FF007F]">✦</span>
                    <InlineTextarea
                      value={bullet}
                      onChange={(value) => onBulletChange?.(idx, value)}
                      disabled={!editable}
                      placeholder={`Mô tả kinh nghiệm ${idx + 1}`}
                      className={isDemo ? "text-[4.2px]" : "text-xs"}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase tracking-tight text-[#0A5C43] ${
                  isDemo ? "text-[6.5px]" : "text-sm"
                }`}
              >
                Dự án trọng tâm
              </h2>
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
                    className={`font-bold text-[#FF007F] ${
                      isDemo ? "text-[4.5px]" : "text-[11px]"
                    }`}
                  />
                  <InlineTextarea
                    value={proj.desc}
                    onChange={(value) => onProjectChange?.(idx, "desc", value)}
                    disabled={!editable}
                    placeholder="Mô tả dự án"
                    className={`text-justify font-medium leading-relaxed text-slate-600 ${
                      isDemo ? "text-[4.5px]" : "text-xs"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <h2
                className={`font-black uppercase tracking-tight text-[#0A5C43] ${
                  isDemo ? "text-[6.5px]" : "text-sm"
                }`}
              >
                Học vấn
              </h2>
              {education?.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 font-medium text-slate-600"
                >
                  <div className={isDemo ? "text-[5px]" : "text-xs"}>
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
                    />
                  </div>
                  <InlineInput
                    value={edu.year}
                    onChange={(value) => onEduChange?.(idx, "year", value)}
                    disabled={!editable}
                    placeholder="Niên khóa"
                    className="w-[110px] text-right text-[8px] font-bold text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`relative flex w-[40%] shrink-0 flex-col justify-between bg-[#0A5C43] text-[#F9F6EE] ${
            isDemo ? "p-3" : "p-6 pb-6 pt-6"
          }`}
        >
          <div className={isDemo ? "space-y-3" : "space-y-6"}>
            <div className="mb-2 flex flex-col items-center">
              <div
                className={`flex items-center justify-center rounded-full bg-[#147358] font-black uppercase tracking-tighter text-[#FF007F] shadow-lg ${
                  isDemo
                    ? "h-12 w-12 border text-xs border-[#FF007F]/60"
                    : "h-24 w-24 border-2 border-dashed border-[#FF007F]/60 text-3xl"
                }`}
              >
                {fullName ? fullName.charAt(0) : "U"}
              </div>
            </div>

            <div className="space-y-2">
              <h3
                className={`border-b border-[#147358] pb-1 font-black uppercase tracking-wider text-[#FF007F] ${
                  isDemo ? "text-[6px]" : "text-xs font-bold"
                }`}
              >
                Kỹ năng
              </h3>
              {skills?.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex justify-between gap-2 font-semibold text-[#F9F6EE] ${
                      isDemo ? "text-[5.5px]" : "text-xs"
                    }`}
                  >
                    <InlineInput
                      value={skill.name}
                      onChange={(value) => onSkillChange?.(index, "name", value)}
                      disabled={!editable}
                      placeholder={`Kỹ năng ${index + 1}`}
                    />
                  </div>
                  <div
                    className={`w-full overflow-hidden rounded-full bg-[#147358] ${
                      isDemo ? "h-1" : "h-1.5"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-[#FF007F]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3
                className={`border-b border-[#147358] pb-1 font-black uppercase tracking-wider text-[#FF007F] ${
                  isDemo ? "text-[6px]" : "text-xs font-bold"
                }`}
              >
                Thành tựu
              </h3>
              <ul
                className={`font-semibold text-slate-200 ${
                  isDemo ? "space-y-1 text-[4.8px]" : "space-y-2.5 text-xs text-slate-100/90"
                }`}
              >
                {awards?.map((award, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="shrink-0 text-[#FF007F]">★</span>
                    <InlineTextarea
                      value={award}
                      onChange={(value) => onAwardChange?.(index, value)}
                      disabled={!editable}
                      placeholder={`Thành tựu ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h3
              className={`border-b border-[#147358] pb-1 font-black uppercase tracking-wider text-[#FF007F] ${
                isDemo ? "text-[6px]" : "text-xs font-bold"
              }`}
            >
              Liên hệ
            </h3>
            <div
              className={`font-semibold text-slate-200 ${
                isDemo ? "space-y-1 text-[4.5px]" : "space-y-2 text-xs"
              }`}
            >
              <p className="truncate">📞 {phone}</p>
              <p className="truncate">✉️ {email}</p>
              <p className="line-clamp-1">📍 {address}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex shrink-0 items-center justify-between bg-linear-to-r from-[#FFB6C1] to-[#FF007F] font-bold text-slate-900 ${
          isDemo ? "h-4 px-2 text-[3.5px]" : "h-9 px-6 text-[10px]"
        }`}
      >
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
        <div className="font-black uppercase tracking-widest text-white">
          EQUITAS RETRO ENGINE
        </div>
      </div>
    </div>
  );
}
