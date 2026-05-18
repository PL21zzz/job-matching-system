import { MOCK_JOBS } from "@/src/constants/jobs";
import { ChevronDown, MapPin, Sparkles, Users } from "lucide-react";

const JobList = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 px-2">
        <p className="text-sm font-bold text-slate-500">
          Tìm thấy{" "}
          <span className="text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">
            {MOCK_JOBS.length}
          </span>{" "}
          việc làm
        </p>
        <button className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-surface px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 hover:border-primary transition-all">
          Mới nhất <ChevronDown size={14} />
        </button>
      </div>

      {MOCK_JOBS.map((job) => (
        <div
          key={job.id}
          className="group p-8 rounded-4xl bg-white dark:bg-surface border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo công ty */}
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-50 dark:bg-secondary flex items-center justify-center border border-slate-100 dark:border-white/10 overflow-hidden">
              <img
                src={job.employer.logoUrl}
                alt={job.employer.companyName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-black group-hover:text-primary transition-colors cursor-pointer leading-tight mb-2 text-slate-900 dark:text-white">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 text-primary">
                      <Users size={16} /> {job.employer.companyName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} /> {job.location}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    98% Match
                  </span>
                </div>
              </div>

              {/* Khối chứa Tags Trợ Năng */}
              <div className="flex flex-wrap gap-2 mb-8">
                {job.accessibilityFeatures?.split(", ").map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-secondary border border-slate-100 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-gray-400 group-hover:border-primary/30 transition-all"
                  >
                    # {tag}
                  </span>
                ))}
              </div>

              {/* Lương & Hành động */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-2xl font-black text-primary italic">
                  {job.salaryText}
                </p>
                <button className="px-8 py-3 rounded-xl bg-primary text-white font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95">
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Phân trang */}
      <div className="flex justify-center gap-3 pt-12">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`w-12 h-12 rounded-xl font-bold transition-all ${p === 1 ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white dark:bg-surface border border-slate-200 dark:border-white/5 text-slate-500 hover:border-primary hover:text-primary"}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobList;
