"use client";

import {
  Award,
  Briefcase,
  Code,
  GraduationCap,
  Star,
  User,
} from "lucide-react";

interface CVFormSidebarProps {
  cvData: any;
  onChange: (field: string, value: string) => void;
  onBulletChange: (index: number, value: string) => void;
  onProjectChange: (index: number, field: string, value: string) => void;
  onEduChange: (index: number, field: string, value: string) => void;
  onSkillChange: (index: number, field: string, value: string | number) => void;
  onCertChange: (index: number, value: string) => void;
  onAwardChange: (index: number, value: string) => void;
}

export default function CVFormSidebar({
  cvData,
  onChange,
  onBulletChange,
  onProjectChange,
  onEduChange,
  onSkillChange,
  onCertChange,
  onAwardChange,
}: CVFormSidebarProps) {
  return (
    <div className="w-full lg:w-105 xl:w-115 bg-slate-800 border-r border-slate-700 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-5 lg:shrink-0 select-text custom-scrollbar">
      <div className="pb-1 border-b border-slate-700">
        <h4 className="text-sm font-black text-white uppercase tracking-tight">
          Trình chỉnh sửa nội dung
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Mọi thay đổi nhỏ nhất sẽ được đồng bộ ngay sang trang giấy A4 bên phải
        </p>
      </div>

      {/* 1. THÔNG TIN CÁ NHÂN */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <User size={12} className="text-blue-400" /> Thông tin cá nhân
        </h3>
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-400">
            Họ và tên
          </label>
          <input
            type="text"
            value={cvData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-400">
            Vị trí ứng tuyển
          </label>
          <input
            type="text"
            value={cvData.jobTitle}
            onChange={(e) => onChange("jobTitle", e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-400">
              Email
            </label>
            <input
              type="email"
              value={cvData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-400">
              Số điện thoại
            </label>
            <input
              type="text"
              value={cvData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-400">
            Địa chỉ cư trú
          </label>
          <input
            type="text"
            value={cvData.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 2. GIỚI THIỆU BẢN THÂN */}
      <div className="space-y-2 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <label className="text-[11px] font-black text-slate-200 uppercase tracking-wider block">
          Giới thiệu bản thân
        </label>
        <textarea
          rows={3}
          value={cvData.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
        />
      </div>

      {/* 3. KINH NGHIỆM LÀM VIỆC */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <Briefcase size={12} className="text-blue-400" /> Kinh nghiệm làm việc
        </h3>
        {cvData.experienceBullets.map((bullet: string, index: number) => (
          <div key={index} className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400">
              Dòng mô tả {index + 1}
            </label>
            <textarea
              rows={2}
              value={bullet}
              onChange={(e) => onBulletChange(index, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        ))}
      </div>

      {/* 4. DỰ ÁN TRỌNG TÂM */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <Code size={12} className="text-blue-400" /> Dự án kỹ thuật trọng tâm
        </h3>
        {cvData.projects.map((proj: any, index: number) => (
          <div
            key={index}
            className="space-y-2 border-b border-slate-700/40 pb-2 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Tên dự án
              </label>
              <input
                type="text"
                value={proj.name}
                onChange={(e) => onProjectChange(index, "name", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Công nghệ áp dụng (Techstack)
              </label>
              <input
                type="text"
                value={proj.tech}
                onChange={(e) => onProjectChange(index, "tech", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-400 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Mô tả chi tiết tính năng
              </label>
              <textarea
                rows={3}
                value={proj.desc}
                onChange={(e) => onProjectChange(index, "desc", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 5. TRÌNH ĐỘ HỌC VẤN */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <GraduationCap size={12} className="text-blue-400" /> Lịch sử học vấn
        </h3>
        {cvData.education.map((edu: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Tên trường đại học
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => onEduChange(index, "school", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">
                  Ngành học
                </label>
                <input
                  type="text"
                  value={edu.major}
                  onChange={(e) => onEduChange(index, "major", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">
                  Niên khóa
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => onEduChange(index, "year", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. KÝ NĂNG CHUYÊN MÔN */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <Star size={12} className="text-blue-400" /> Kỹ năng chuyên môn
        </h3>
        {cvData.skills.map((skill: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => onSkillChange(index, "name", e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-slate-200 font-semibold w-2/3"
              />
              <span className="text-cyan-400 font-bold">{skill.level}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={skill.level}
              onChange={(e) =>
                onSkillChange(index, "level", parseInt(e.target.value))
              }
              className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* 7. CHỨNG CHỈ */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <Award size={12} className="text-blue-400" /> Chứng chỉ đạt được
        </h3>
        {cvData.certifications.map((cert: string, index: number) => (
          <div key={index} className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400">
              Chứng chỉ {index + 1}
            </label>
            <input
              type="text"
              value={cert}
              onChange={(e) => onCertChange(index, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>
        ))}
      </div>

      {/* 8. GIẢI THƯỞNG */}
      <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
          <Award size={12} className="text-amber-400" /> Danh hiệu & Giải thưởng
        </h3>
        {cvData.awards.map((award: string, index: number) => (
          <div key={index} className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400">
              Giải thưởng {index + 1}
            </label>
            <input
              type="text"
              value={award}
              onChange={(e) => onAwardChange(index, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
