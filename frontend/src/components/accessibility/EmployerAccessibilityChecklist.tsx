"use client";

import {
  FEATURED_EMPLOYER_ACCESSIBILITY_OPTIONS,
  MORE_EMPLOYER_ACCESSIBILITY_OPTIONS,
} from "@/src/constants/employer-accessibility";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface EmployerAccessibilityChecklistProps {
  helperText?: string;
  selectedOptions: string[];
  title?: string;
  onToggle: (value: string) => void;
}

export default function EmployerAccessibilityChecklist({
  helperText,
  selectedOptions,
  title = "Tiện ích trợ năng hạ tầng văn phòng hiện có",
  onToggle,
}: EmployerAccessibilityChecklistProps) {
  const [showMore, setShowMore] = useState(false);

  const normalizedSelected = useMemo(
    () => new Set(selectedOptions),
    [selectedOptions],
  );

  const renderOption = (item: string) => {
    const checked = normalizedSelected.has(item);

    return (
      <label
        key={item}
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
          checked
            ? "border-primary/40 bg-primary/8"
            : "border-slate-200 bg-white hover:border-primary/30 dark:border-border-subtle dark:bg-secondary"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(item)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
          {item}
        </span>
      </label>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </label>
        {helperText ? (
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {FEATURED_EMPLOYER_ACCESSIBILITY_OPTIONS.map(renderOption)}
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-hover"
        >
          {showMore ? (
            <>
              Thu gọn <ChevronUp size={16} />
            </>
          ) : (
            <>
              Xem thêm tiện ích <ChevronDown size={16} />
            </>
          )}
        </button>

        {showMore ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {MORE_EMPLOYER_ACCESSIBILITY_OPTIONS.map(renderOption)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
