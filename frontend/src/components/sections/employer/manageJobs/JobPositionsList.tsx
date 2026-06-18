"use client";

import Card from "@/src/components/ui/Card";
import { Briefcase, Calendar } from "lucide-react";

interface JobPositionsListProps {
  jobs: any[];
  selectedJobId: string | null;
  onSelectJob: (id: string) => void;
}

export default function JobPositionsList({
  jobs,
  selectedJobId,
  onSelectJob,
}: JobPositionsListProps) {
  if (jobs.length === 0) {
    return (
      <Card layoutClassName="p-8 text-center text-xs font-bold text-slate-400 dark:text-slate-500 rounded-3xl">
        Chưa có bài đăng tuyển dụng nào trên hệ thống.
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin select-none">
      {jobs.map((job) => {
        const isActive = job.id === selectedJobId;
        return (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className={`cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 rounded-3xl ${
              isActive
                ? "ring-2 ring-primary border-transparent shadow-lg"
                : "border border-slate-100 dark:border-white/5"
            }`}
          >
            <Card layoutClassName="p-5 space-y-4 bg-slate-50 dark:bg-surface rounded-3xl">
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                    <Briefcase size={10} /> {job.status}
                  </span>
                  <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white line-clamp-1 mt-1">
                    {job.title}
                  </h3>
                </div>

                {/* Đếm số đơn ứng tuyển mới tinh (status === APPLIED) */}
                {job.newCount > 0 && (
                  <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse shrink-0">
                    {job.newCount} ĐƠN MỚI
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2 border-t border-slate-200/60 dark:border-white/5">
                <Calendar size={12} /> Cập nhật tin: 15/06/2026
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
