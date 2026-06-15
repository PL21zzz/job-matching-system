"use client";

import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import {
  ArrowRight,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import hook để chuyển trang

interface JobSidebarActionsProps {
  job: any;
  onApplyClick: () => void;
}

export default function JobSidebarActions({
  job,
  onApplyClick,
}: JobSidebarActionsProps) {
  const router = useRouter(); // Khởi tạo router điều hướng

  return (
    <div className="space-y-6 lg:h-full shrink-0 select-none">
      {/* ACTION CARD */}
      <Card shadow={true} layoutClassName="p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Mức lương đề xuất
          </span>
          <p className="text-2xl sm:text-3xl font-black text-primary italic tracking-tight">
            {job.salaryText ||
              `${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} VND`}
          </p>
        </div>

        <Button onClick={onApplyClick}>
          Ứng tuyển ngay <ArrowRight size={16} />
        </Button>

        <Button
          variant="secondary"
          className="border-dashed border-primary/40 text-primary hover:bg-primary/5! mt-2 normal-case text-xs font-bold"
          onClick={() => router.push(`/resumes/templates?jobId=${job.id}`)}
        >
          <Sparkles size={14} className="text-primary animate-pulse" /> Tạo CV
          khớp Job này bằng AI
        </Button>

        <div className="pt-2 border-t border-slate-200 dark:border-border-subtle flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> Ngày đăng tin:
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-black">
            {new Date(job.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </Card>

      {/* VỀ NHÀ TUYỂN DỤNG */}
      <Card layoutClassName="p-6 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Về nhà tuyển dụng
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">
              {job.employer?.companyName}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            {job.employer?.description ||
              "Chưa cập nhật thông tin giới thiệu doanh nghiệp."}
          </p>
          <div className="pt-3 border-t border-slate-200 dark:border-border-subtle flex gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MapPin size={16} className="shrink-0 text-slate-400 mt-0.5" />
            <span className="leading-normal">{job.employer?.address}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
