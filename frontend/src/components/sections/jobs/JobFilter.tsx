import { ACCESSIBILITY_OPTIONS } from "@/src/constants/jobs";
import { Filter } from "lucide-react";

const JobFilter = () => {
  return (
    <div className="sticky top-28 p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border border-slate-100 dark:border-white/5 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter size={18} className="text-primary" /> Bộ lọc
        </h3>
        <button className="text-xs font-bold text-primary hover:underline">
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-8">
        {/* Dạng khuyết tật */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
            Dạng khuyết tật hỗ trợ
          </p>
          <div className="space-y-3">
            {["Vận động", "Khiếm thính", "Khiếm thị", "Khác"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-5 h-5 border-2 border-slate-200 dark:border-white/10 rounded-md flex items-center justify-center group-hover:border-primary transition-colors bg-white dark:bg-secondary">
                  <div className="w-2 h-2 bg-primary rounded-sm opacity-0 group-hover:opacity-20" />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tiện ích trợ năng */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
            Tiện ích trợ năng
          </p>
          <div className="space-y-3">
            {ACCESSIBILITY_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-5 h-5 border-2 border-slate-200 dark:border-white/10 rounded-md flex items-center justify-center group-hover:border-primary transition-colors bg-white dark:bg-secondary" />
                <span className="text-sm font-bold text-slate-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
