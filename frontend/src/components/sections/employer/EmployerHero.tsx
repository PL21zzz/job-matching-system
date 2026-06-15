"use client";

import { useRouter } from "next/navigation";

const EmployerHero = () => {
  const router = useRouter();

  const handleStartNow = () => {
    router.push("/employer/create-job");
  };

  const handleManageJobs = () => {
    router.push("/employer/manage-jobs");
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-b border-border-subtle">
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Hi-tech Recruitment for DE&I
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight dark:text-white uppercase tracking-tighter">
            Tuyển dụng tài năng, <br />
            <span className="text-primary italic font-serif">
              Không phải sự hạn chế.
            </span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
            Equitas AI giúp doanh nghiệp xây dựng đội ngũ đa dạng với sức mạnh
            của trí tuệ nhân tạo công bằng, loại bỏ định kiến vô thức trong từng
            hồ sơ.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartNow}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-primary/20 active:scale-95 hover:scale-105"
            >
              Bắt đầu ngay
            </button>

            <button
              onClick={handleManageJobs}
              className="px-8 py-4 rounded-2xl border-2 border-primary text-primary font-black hover:bg-primary/5 transition-all active:scale-95 hover:scale-105"
            >
              Quản lý tuyển dụng
            </button>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
            alt="AI Brain Recruitment"
            className="relative z-10 w-full rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-700 border border-border-subtle shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default EmployerHero;
