"use client";

import { SlidersHorizontal, Sparkles, Target } from "lucide-react";

interface CVFormSidebarProps {
  cvData: any;
  onChange: (field: string, value: string) => void;
  onSkillChange: (index: number, field: string, value: string | number) => void;
}

export default function CVFormSidebar({
  cvData,
  onChange,
  onSkillChange,
}: CVFormSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-b border-slate-800 bg-slate-900/95 xl:border-r xl:border-b-0">
      <div className="space-y-5 overflow-y-auto p-4 sm:p-5">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Chỉnh nhanh
            </h3>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Phần lớn nội dung giờ có thể sửa trực tiếp trên CV. Khung bên này chỉ
            giữ lại vài điều khiển ngắn gọn để đỡ rối.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Liên kết / điểm nhấn
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Portfolio / website
              </label>
              <input
                type="text"
                value={cvData.portfolioUrl}
                onChange={(e) => onChange("portfolioUrl", e.target.value)}
                placeholder="Ví dụ: portfolio.tencuaban.com"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </div>

            <div className="rounded-2xl border border-dashed border-cyan-500/20 bg-cyan-500/5 p-4 text-xs leading-6 text-slate-300">
              Gợi ý: với CV ứng tuyển việc làm phổ thông hoặc dịch vụ, bạn có thể
              đổi “Portfolio” thành “Zalo liên hệ”, “Facebook cá nhân” hoặc bỏ trống
              để ẩn luôn khỏi CV.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Mức kỹ năng
            </h3>
          </div>

          <div className="space-y-4">
            {cvData.skills.map((skill: any, index: number) => (
              <div key={`${skill.name}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-slate-200">
                    {skill.name || `Kỹ năng ${index + 1}`}
                  </span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-black text-cyan-300">
                    {skill.level}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={skill.level}
                  onChange={(e) =>
                    onSkillChange(index, "level", parseInt(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white">
            Mẹo dùng nhanh
          </h3>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            <li>• Bấm vào tên, tiêu đề, mô tả, kinh nghiệm để sửa trực tiếp.</li>
            <li>• Khi in PDF, hệ thống lấy đúng khổ A4 ở vùng preview.</li>
            <li>• Nếu template nào chưa đẹp, mình có thể làm tiếp bản mới riêng.</li>
          </ul>
        </section>
      </div>
    </aside>
  );
}
