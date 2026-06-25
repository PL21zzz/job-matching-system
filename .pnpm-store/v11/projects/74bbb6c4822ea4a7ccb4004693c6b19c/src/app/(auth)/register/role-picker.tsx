"use client";

import { Briefcase, User } from "lucide-react";

interface RolePickerProps {
  onSelect: (role: "Candidate" | "Employer") => void;
}

export const RolePicker = ({ onSelect }: RolePickerProps) => (
  <div className="animate-in fade-in slide-in-from-right duration-500">
    {/* Tiêu đề tự động đổi màu */}
    <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-2 tracking-tighter transition-colors">
      Bạn là ai?
    </h2>
    <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm transition-colors">
      Chọn vai trò để bắt đầu hành trình của bạn.
    </p>

    <div className="grid grid-cols-1 gap-4">
      {/* 🟢 LỰA CHỌN 1: ỨNG VIÊN */}
      <button
        onClick={() => onSelect("Candidate")}
        className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-4 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/5 active:scale-[0.98] group bg-slate-50/50 dark:bg-white/5"
      >
        {/* Vòng tròn chứa Icon - Thêm transition mượt mà và shadow mờ */}
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg shadow-primary/5">
          <User size={24} />
        </div>
        <div className="text-left">
          {/* Chữ "Ứng viên" tự động đổi màu và phát sáng khi hover */}
          <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors group-hover:text-primary">
            Ứng viên
          </p>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5 transition-colors">
            Tôi đang tìm kiếm cơ hội việc làm
          </p>
        </div>
      </button>

      {/* 🔵 LỰA CHỌN 2: NHÀ TUYỂN DỤNG */}
      <button
        onClick={() => onSelect("Employer")}
        className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-4 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/5 active:scale-[0.98] group bg-slate-50/50 dark:bg-white/5"
      >
        {/* Vòng tròn chứa Icon */}
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg shadow-primary/5">
          <Briefcase size={24} />
        </div>
        <div className="text-left">
          {/* Chữ "Nhà tuyển dụng" tự động đổi màu */}
          <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors group-hover:text-primary">
            Nhà tuyển dụng
          </p>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5 transition-colors">
            Tôi muốn đăng tin và tìm nhân tài
          </p>
        </div>
      </button>
    </div>
  </div>
);
