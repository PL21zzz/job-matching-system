"use client";

import ProvinceSelect from "@/src/components/ui/ProvinceSelect";
import { Activity, ArrowRight, MapPin, Search, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    }

    if (location) {
      params.set("location", location);
    }

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 transition-colors dark:bg-secondary md:py-32">
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="relative z-10 space-y-6 text-left lg:col-span-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Activity size={12} className="animate-pulse" />
            Nền tảng tuyển dụng công bằng ứng dụng AI
          </span>

          <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Nơi Kết Nối Tài Năng,
            <br />
            <span className="text-primary">Thúc Đẩy Tiềm Năng.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-gray-400 sm:text-lg">
            Equitas AI là hệ sinh thái tìm việc thông minh dành cho tuyển dụng hòa
            nhập, giúp người khuyết tật tiếp cận cơ hội nghề nghiệp phù hợp nhanh
            hơn và rõ ràng hơn.
          </p>

          <div className="flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-xl transition-colors dark:border-white/5 dark:bg-surface md:flex-row md:items-center">
            <div className="flex min-h-[48px] w-full flex-[1.25] items-center gap-2 border-b border-slate-100 pb-2 md:border-r md:border-b-0 md:pb-0">
              <Search className="text-primary" size={20} />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
                placeholder="Từ khóa, kỹ năng..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 dark:text-white"
              />
            </div>

            <div className="flex min-h-[48px] w-full flex-1 items-center gap-2">
              <MapPin className="shrink-0 text-primary" size={20} />
              <ProvinceSelect
                value={location}
                onChange={setLocation}
                className="w-full"
                buttonClassName="pr-1 text-slate-900 dark:text-white"
                dropdownClassName="min-w-[320px]"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-all hover:bg-primary-hover md:w-auto"
            >
              Tìm kiếm <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center lg:col-span-5">
          <div className="relative flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse dark:bg-primary/5" />
            <div className="absolute h-full w-full animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-primary/30 dark:border-primary/20" />
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-linear-to-tr from-primary/30 to-purple-500/30 shadow-inner group sm:h-56 sm:w-56">
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white/5 p-4 text-center backdrop-blur-sm dark:bg-secondary/80">
                <Zap className="animate-bounce text-primary" size={24} />
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-gray-500">
                  Equitas Engine
                </span>
                <span className="mt-1 text-sm font-extrabold text-slate-800 dark:text-white">
                  Smart AI Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
