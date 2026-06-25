"use client";
import { Activity, ArrowRight, MapPin, Search, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-10 pb-20 md:py-32 overflow-hidden bg-white dark:bg-secondary transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 text-left space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Activity size={12} className="animate-pulse" /> Nền tảng tuyển dụng
            công bằng ứng dụng AI
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Nơi Kết Nối Tài Năng, <br />
            <span className="text-primary">Thúc Đẩy Tiềm Năng.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 max-w-xl leading-relaxed">
            Equitas AI: Hệ sinh thái tìm kiếm và kết hợp việc làm thông minh,
            phá bỏ mọi định kiến, mở rộng tối đa cơ hội nghề nghiệp bình đẳng
            cho người khuyết tật.
          </p>

          <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xl flex flex-col md:flex-row gap-3 items-center max-w-2xl transition-colors">
            <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 pb-2 md:pb-0">
              <Search className="text-primary" size={20} />
              <input
                type="text"
                placeholder="Từ khóa, kỹ năng..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 w-full">
              <MapPin className="text-primary" size={20} />
              <input
                type="text"
                placeholder="Địa điểm..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
              />
            </div>
            <Link
              href="/login"
              className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all"
            >
              Tìm Kiếm <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute w-full h-full rounded-full border border-dashed border-primary/30 dark:border-primary/20 animate-[spin_30s_linear_infinite]" />
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-linear-to-tr from-primary/30 to-purple-500/30 flex items-center justify-center border border-white/10 shadow-inner group">
              <div className="absolute inset-3 rounded-full bg-white/5 dark:bg-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <Zap className="text-primary animate-bounce" size={24} />
                <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">
                  Equitas Engine
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
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
