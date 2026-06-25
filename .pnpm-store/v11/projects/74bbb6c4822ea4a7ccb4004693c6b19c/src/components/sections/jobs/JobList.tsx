"use client";

import AvatarBadge from "@/src/components/ui/AvatarBadge";
import { getAccessibilityTags } from "@/src/lib/job-accessibility";
import { ChevronDown, Loader2, MapPin, Sparkles, Users } from "lucide-react";
import Link from "next/link";

interface JobListProps {
  jobs: any[];
  loading: boolean;
}

const JobList = ({ jobs, loading }: JobListProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-400">
          Đang tìm kiếm việc làm phù hợp với cấu hình trợ năng...
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-32 border border-dashed border-slate-200 dark:border-white/10 rounded-4xl bg-slate-50/5">
        <p className="text-lg font-bold text-slate-400">
          Không tìm thấy việc làm nào khớp với tiêu chí lựa chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-8 px-2">
        <p className="text-sm font-bold text-slate-500">
          Tìm thấy{" "}
          <span className="text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4 font-black">
            {jobs.length}
          </span>{" "}
          việc làm phù hợp
        </p>
        <button className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-surface px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 hover:border-primary transition-all cursor-pointer">
          Mới nhất <ChevronDown size={14} />
        </button>
      </div>

      {jobs.map((job) => {
        const accessibilityTags = getAccessibilityTags(job.accessibilityFeatures);

        return (
          <div
            key={job.id}
            className="group p-8 rounded-4xl bg-surface dark:bg-surface border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <AvatarBadge
                label={job.employer?.companyName || "Doanh nghiệp"}
                type="company"
                className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 text-xl shadow-inner select-none dark:border-white/10"
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <Link href={`/jobs/${job.id}`}>
                      <h2 className="text-2xl font-black group-hover:text-primary transition-colors cursor-pointer leading-tight mb-2 text-slate-900 dark:text-white uppercase tracking-tight">
                        {job.title}
                      </h2>
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Users size={16} />{" "}
                        {job.employer?.companyName || "Doanh nghiệp ẩn danh"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} /> {job.location}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2 select-none">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      AI Match
                    </span>
                  </div>
                </div>

                {job?.suitableDisabilities &&
                  job.suitableDisabilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 select-none">
                      {job.suitableDisabilities.map((disability: any) => (
                        <span
                          key={disability.id}
                          className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                        >
                          {disability.name}
                        </span>
                      ))}
                    </div>
                  )}

                <div className="flex flex-wrap gap-2 mb-8 select-none">
                  {accessibilityTags.length > 0 ? (
                    accessibilityTags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:border-primary/30 transition-all"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Cơ cấu hỗ trợ phổ thông
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                  <p className="text-2xl font-black text-primary italic select-none">
                    {job.salaryText || "Thỏa thuận"}
                  </p>
                  <Link href={`/jobs/${job.id}`}>
                    <button className="px-8 py-3 rounded-xl bg-primary text-white font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobList;
