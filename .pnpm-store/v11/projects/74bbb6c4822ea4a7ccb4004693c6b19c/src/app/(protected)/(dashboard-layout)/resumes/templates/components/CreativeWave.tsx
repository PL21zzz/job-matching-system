"use client";

import {
  InlineInput,
  InlineTextarea,
} from "../../editor/components/InlineEditable";
import { getDisabilityTag } from "@/src/utils/resume";
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
import { CVDataProps } from "../CVTemplates";

export function CreativeWaveTemplate({
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
  awards,
  disabilityType,
  isDemo = false,
  editable = false,
  onFieldChange,
  onBulletChange,
  onProjectChange,
  onEduChange,
  onSkillChange,
  onCertChange,
  onAwardChange,
}: CVDataProps) {
  const showPortfolio = !!portfolioUrl?.trim();

  return (
    <div
      className={`relative flex h-full w-full bg-[#F8FAFC] font-sans text-slate-800 ${
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
        className={`flex shrink-0 flex-col justify-between bg-[#111827] text-slate-200 ${
          isDemo ? "w-[35%] p-3" : "w-[35%] p-6 pb-8 pt-12"
        }`}
      >
        <div className={isDemo ? "space-y-4" : "space-y-8"}>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center rounded-2xl bg-[#1F2937] font-black uppercase tracking-tighter text-cyan-400 shadow-xl ${
                isDemo
                  ? "h-16 w-16 border text-sm border-cyan-500/50"
                  : "h-32 w-32 border-2 border-cyan-500/50 text-4xl"
              }`}
            >
              {fullName ? fullName.charAt(0) : "U"}
            </div>
          </div>

          <div className="space-y-2">
            <h3
              className={`border-b border-slate-800 pb-1.5 font-black uppercase tracking-wider text-cyan-400 ${
                isDemo ? "text-[6px]" : "text-xs tracking-widest"
              }`}
            >
              Thông tin cá nhân
            </h3>
            <div
              className={`font-medium text-slate-300 ${
                isDemo ? "space-y-1 text-[5px]" : "space-y-3 text-xs"
              }`}
            >
              <p className="flex items-center gap-2.5">
                <Phone size={isDemo ? 5 : 12} className="shrink-0 text-cyan-400" />
                <InlineInput
                  value={phone}
                  onChange={(value) => onFieldChange?.("phone", value)}
                  disabled={!editable}
                  placeholder="Số điện thoại"
                />
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={isDemo ? 5 : 12} className="shrink-0 text-cyan-400" />
                <InlineInput
                  value={email}
                  onChange={(value) => onFieldChange?.("email", value)}
                  disabled={!editable}
                  placeholder="Email"
                />
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={isDemo ? 5 : 12} className="shrink-0 text-cyan-400" />
                <InlineInput
                  value={address}
                  onChange={(value) => onFieldChange?.("address", value)}
                  disabled={!editable}
                  placeholder="Địa chỉ"
                />
              </p>
              {showPortfolio && (
                <p className="flex items-center gap-2.5">
                  <Globe size={isDemo ? 5 : 12} className="shrink-0 text-cyan-400" />
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

          <div className="space-y-2">
            <h3
              className={`border-b border-slate-800 pb-1.5 font-black uppercase tracking-wider text-cyan-400 ${
                isDemo ? "text-[6px]" : "text-xs tracking-widest"
              }`}
            >
              Kỹ năng chuyên môn
            </h3>
            <div className={isDemo ? "space-y-1.5" : "space-y-4"}>
              {skills?.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex justify-between gap-2 font-semibold text-slate-300 ${
                      isDemo ? "text-[5.5px]" : "text-xs"
                    }`}
                  >
                    <InlineInput
                      value={skill.name}
                      onChange={(value) => onSkillChange?.(index, "name", value)}
                      disabled={!editable}
                      placeholder={`Kỹ năng ${index + 1}`}
                    />
                    <span className="font-bold text-cyan-400">{skill.level}%</span>
                  </div>
                  <div
                    className={`w-full overflow-hidden rounded-full bg-[#1F2937] ${
                      isDemo ? "h-0.5" : "h-1"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3
              className={`border-b border-slate-800 pb-1.5 font-black uppercase tracking-wider text-cyan-400 ${
                isDemo ? "text-[6px]" : "text-xs tracking-widest"
              }`}
            >
              Chứng chỉ
            </h3>
            <ul
              className={`font-semibold text-slate-300 ${
                isDemo ? "space-y-1 text-[5px]" : "space-y-3 text-xs"
              }`}
            >
              {certifications?.map((cert, index) => (
                <li key={index} className="flex items-start gap-1.5 leading-tight">
                  <span className="shrink-0 text-cyan-400">▪</span>
                  <InlineTextarea
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
      </div>

      <div
        className={`flex w-[65%] flex-col bg-white ${
          isDemo ? "p-4" : "p-9 pb-10 pt-12"
        }`}
      >
        <div className={`border-b border-slate-100 ${isDemo ? "mb-3 pb-2" : "mb-6 pb-5"}`}>
          <InlineInput
            value={fullName}
            onChange={(value) => onFieldChange?.("fullName", value)}
            disabled={!editable}
            placeholder="Họ và tên"
            className={`font-black uppercase tracking-tight text-slate-900 ${
              isDemo ? "text-sm" : "text-3xl font-black"
            }`}
          />
          <InlineInput
            value={jobTitle}
            onChange={(value) => onFieldChange?.("jobTitle", value)}
            disabled={!editable}
            placeholder="Vị trí ứng tuyển"
            className={`mt-1.5 font-extrabold uppercase tracking-widest text-cyan-600 ${
              isDemo ? "text-[5.5px]" : "text-xs font-bold"
            }`}
          />
        </div>

        <div
          className={`flex flex-1 flex-col justify-between ${
            isDemo ? "space-y-3" : "space-y-6"
          }`}
        >
          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`flex items-center gap-2 font-black uppercase text-slate-900 ${
                isDemo ? "text-[6.5px]" : "text-xs tracking-wider"
              }`}
            >
              <User size={isDemo ? 5 : 12} className="shrink-0 text-cyan-600" />
              Giới thiệu bản thân
            </h2>
            <div className="h-px w-full bg-slate-100" />
            <InlineTextarea
              value={summary}
              onChange={(value) => onFieldChange?.("summary", value)}
              disabled={!editable}
              rows={3}
              placeholder="Tóm tắt ngắn gọn thế mạnh của bạn."
              className={`text-justify font-medium leading-relaxed text-slate-600 ${
                isDemo ? "text-[5px]" : "pl-0.5 text-xs text-slate-600/90"
              }`}
            />
          </div>

          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`flex items-center gap-2 font-black uppercase text-slate-900 ${
                isDemo ? "text-[6.5px]" : "text-xs tracking-wider"
              }`}
            >
              <Briefcase
                size={isDemo ? 5 : 12}
                className="shrink-0 text-cyan-600"
              />
              Kinh nghiệm làm việc
            </h2>
            <div className="h-px w-full bg-slate-100" />
            <div className="mt-2 pl-0.5">
              <div className="flex items-baseline justify-between gap-3 font-bold text-slate-800">
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
                  placeholder="Ví dụ: Nhân viên dịch vụ | Doanh nghiệp ABC"
                  className={
                    isDemo
                      ? "text-[5.5px]"
                      : "text-xs font-extrabold text-slate-800"
                  }
                />
                <InlineInput
                  value={experienceDuration || ""}
                  onChange={(value) => onFieldChange?.("experienceDuration", value)}
                  disabled={!editable}
                  placeholder="Thời gian"
                  className="w-[120px] text-right text-[9px] font-bold text-slate-400"
                />
              </div>
              <ul
                className={`list-none text-justify font-medium text-slate-600 ${
                  isDemo ? "mt-1 space-y-1 text-[4.5px]" : "mt-3 space-y-3 text-xs text-slate-600/90"
                }`}
              >
                {experienceBullets?.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="mt-1.5 shrink-0 text-cyan-500">▪</span>
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

          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`flex items-center gap-2 font-black uppercase text-slate-900 ${
                isDemo ? "text-[6.5px]" : "text-xs tracking-wider"
              }`}
            >
              <Code size={isDemo ? 5 : 12} className="shrink-0 text-cyan-600" />
              Dự án / công việc nổi bật
            </h2>
            <div className="h-px w-full bg-slate-100" />
            <div className={isDemo ? "mt-1 space-y-1 pl-0.5" : "mt-2 space-y-3.5 pl-0.5"}>
              {projects?.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <InlineInput
                    value={proj.name}
                    onChange={(value) => onProjectChange?.(idx, "name", value)}
                    disabled={!editable}
                    placeholder={`Tên mục nổi bật ${idx + 1}`}
                    className={`font-extrabold text-slate-800 ${
                      isDemo ? "text-[5.5px]" : "text-xs font-black text-slate-900"
                    }`}
                  />
                  <InlineInput
                    value={proj.tech}
                    onChange={(value) => onProjectChange?.(idx, "tech", value)}
                    disabled={!editable}
                    placeholder="Công cụ / kỹ năng áp dụng"
                    className={`font-bold text-cyan-600 ${
                      isDemo ? "text-[4.5px]" : "text-[11px]"
                    }`}
                  />
                  <InlineTextarea
                    value={proj.desc}
                    onChange={(value) => onProjectChange?.(idx, "desc", value)}
                    disabled={!editable}
                    placeholder="Mô tả ngắn"
                    className={`text-justify font-medium leading-relaxed text-slate-500 ${
                      isDemo ? "text-[4.5px]" : "text-xs text-slate-500/90"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`flex items-center gap-2 font-black uppercase text-slate-900 ${
                isDemo ? "text-[6.5px]" : "text-xs tracking-wider"
              }`}
            >
              <GraduationCap
                size={isDemo ? 5 : 12}
                className="shrink-0 text-cyan-600"
              />
              Học vấn
            </h2>
            <div className="h-px w-full bg-slate-100" />
            <div className={isDemo ? "mt-1 space-y-1 pl-0.5" : "mt-2 space-y-3 pl-0.5"}>
              {education?.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 font-medium text-slate-600"
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
                      className="font-semibold text-slate-500"
                    />
                  </div>
                  <InlineInput
                    value={edu.year}
                    onChange={(value) => onEduChange?.(idx, "year", value)}
                    disabled={!editable}
                    placeholder="Niên khóa"
                    className="w-[110px] text-right text-[9px] font-bold text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={isDemo ? "space-y-0.5" : "space-y-2"}>
            <h2
              className={`flex items-center gap-2 font-black uppercase text-slate-900 ${
                isDemo ? "text-[6.5px]" : "text-xs tracking-wider"
              }`}
            >
              <Award size={isDemo ? 5 : 12} className="shrink-0 text-cyan-600" />
              Thành tựu
            </h2>
            <div className="h-px w-full bg-slate-100" />
            <ul
              className={`list-none font-medium text-slate-600 ${
                isDemo ? "space-y-0.5 pl-0.5 text-[5px]" : "mt-2 space-y-2 pl-0.5 text-xs"
              }`}
            >
              {awards?.map((award, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="font-bold text-cyan-500">✓</span>
                  <InlineInput
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

        <div
          className={`mt-4 border-t border-slate-100 pt-3 text-center font-bold tracking-wider text-slate-400 ${
            isDemo ? "text-[3.5px]" : "text-[10px]"
          }`}
        >
          POWERED BY EQUITAS AI RESUME ENGINE
        </div>
      </div>
    </div>
  );
}
