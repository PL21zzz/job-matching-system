"use client";

import {
  ACCESSIBILITY_OPTIONS,
  DISABILITY_FOCUS_OPTIONS,
} from "@/src/constants/jobs";
import { Filter } from "lucide-react";

interface JobFilterProps {
  filters: any;
  setFilters: (filters: any) => void;
  categories: Array<{ id: number; name: string }>;
}

const JobFilter = ({ filters, setFilters, categories }: JobFilterProps) => {
  const handleAccessibilityChange = (option: string) => {
    setFilters({
      ...filters,
      accessibility: filters.accessibility === option ? "" : option,
    });
  };

  const handleClearAll = () => {
    setFilters({
      search: "",
      location: "",
      categoryId: "",
      accessibility: "",
      disabilityFocus: "",
    });
  };

  return (
    <div className="w-full lg:sticky lg:top-24 h-fit p-5 sm:p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border border-slate-100 dark:border-white/5 space-y-8 select-none">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter size={18} className="text-primary" /> Bộ lọc
        </h3>
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-8">
        {/* Ngành nghề */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Ngành nghề ứng tuyển
          </p>
          <select
            value={filters.categoryId}
            onChange={(e) =>
              setFilters({ ...filters, categoryId: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-white dark:bg-secondary border border-slate-200 dark:border-white/10 text-sm font-bold outline-none text-slate-700 dark:text-gray-300 cursor-pointer focus:border-primary"
          >
            <option value="">Tất cả ngành nghề</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Phù hợp theo dạng khuyết tật
          </p>
          <div className="flex flex-wrap gap-2">
            {DISABILITY_FOCUS_OPTIONS.map((option) => {
              const isActive = filters.disabilityFocus === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      disabilityFocus:
                        isActive ? "" : option.label,
                    })
                  }
                  className={`rounded-full px-3 py-2 text-xs font-black transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white text-slate-600 hover:text-primary dark:bg-secondary dark:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tiện ích trợ năng */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Tiện ích trợ năng đặc thù
          </p>
          <div className="space-y-3">
            {ACCESSIBILITY_OPTIONS.map((option) => {
              const isChecked = filters.accessibility === option;
              return (
                <label
                  key={option}
                  onClick={() => handleAccessibilityChange(option)}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors bg-white dark:bg-secondary ${
                      isChecked
                        ? "border-primary"
                        : "border-slate-200 dark:border-white/10 group-hover:border-primary"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 bg-primary rounded-sm transition-opacity ${isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-20"}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold transition-colors ${
                      isChecked
                        ? "text-primary"
                        : "text-slate-600 dark:text-gray-400 group-hover:text-primary"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
