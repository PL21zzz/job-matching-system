"use client";

import { VIETNAM_PROVINCES } from "@/src/constants/vietnam-provinces";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ProvinceSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export default function ProvinceSelect({
  value,
  onChange,
  placeholder = "Chọn tỉnh / thành phố",
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
}: ProvinceSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filteredProvinces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return VIETNAM_PROVINCES;
    }

    return VIETNAM_PROVINCES.filter((province) =>
      province.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const label = value || placeholder;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border border-transparent bg-transparent px-0 text-left text-sm outline-none transition focus:border-primary ${buttonClassName}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={value ? "" : "text-slate-400"}>{label}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+8px)] left-0 z-50 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 ${dropdownClassName}`}
        >
          <div className="border-b border-slate-200 p-3 dark:border-white/10">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tỉnh / thành phố..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary dark:border-white/10 dark:bg-slate-950 dark:text-white"
              autoFocus
            />
          </div>

          <div className="max-h-72 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-white/5 ${
                !value ? "bg-primary/10 text-primary" : "text-slate-700 dark:text-slate-200"
              }`}
            >
              <span>{placeholder}</span>
              {!value && <Check size={16} />}
            </button>

            {filteredProvinces.length > 0 ? (
              filteredProvinces.map((province) => {
                const isSelected = value === province;

                return (
                  <button
                    key={province}
                    type="button"
                    onClick={() => {
                      onChange(province);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-white/5 ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span>{province}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Không tìm thấy tỉnh / thành phố phù hợp.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
