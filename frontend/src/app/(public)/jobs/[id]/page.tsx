"use client";

import { jobService } from "@/src/services/jobService";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

// Import các section mộc vừa tách
import JobAccessibility from "@/src/components/sections/jobs/detailJob/JobAccessibility";
import JobContent from "@/src/components/sections/jobs/detailJob/JobContent";
import JobHero from "@/src/components/sections/jobs/detailJob/JobHero";
import JobSidebarActions from "@/src/components/sections/jobs/detailJob/JobSidebarActions";

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiMatchScore, setAiMatchScore] = useState<number>(95);

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setLoading(true);
        const res: any = await jobService.getJobById(jobId);
        const jobData = res.data?.data || res.data || res;
        setJob(jobData);
      } catch (err: any) {
        console.error("Lỗi khi tải chi tiết job:", err);
        setError(
          err.response?.data?.message || "Không thể tải thông tin công việc.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-white dark:bg-secondary flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white">
        Đang tải dữ liệu công việc...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full h-screen bg-white dark:bg-secondary flex items-center justify-center font-bold text-sm text-red-500">
        {error || "Không tìm thấy công việc yêu cầu."}
      </div>
    );
  }

  const processedRequirements = job.requirements
    ? job.requirements.split("\n").filter((item: string) => item.trim() !== "")
    : [];
  const processedDescription =
    job.description || "Chưa có mô tả chi tiết từ nhà tuyển dụng.";

  return (
    <div className="w-full h-screen bg-white dark:bg-secondary text-slate-900 dark:text-white flex flex-col overflow-hidden transition-colors duration-300">
      {/* VÙNG HEADER */}
      <div className="w-full max-w-7xl mx-auto pt-8 pb-4 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Việc làm
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold truncate max-w-50 sm:max-w-none">
              {job.title}
            </span>
          </div>

          <Link
            href="/jobs"
            className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft size={14} /> Quay lại danh sách
          </Link>
        </div>
      </div>

      {/* VÙNG NỘI DUNG CHÍNH CHIA LÀM CÁC COMPONENT GỌN GÀNG */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-start">
          {/* CỘT TRÁI (SCROLL ĐỘC LẬP) */}
          <div className="lg:col-span-2 h-full overflow-y-auto pr-2 space-y-8 scrollbar-thin">
            <JobHero job={job} aiMatchScore={aiMatchScore} />
            <JobAccessibility job={job} />
            <JobContent
              processedDescription={processedDescription}
              processedRequirements={processedRequirements}
            />
          </div>

          {/* CỘT PHẢI (CỐ ĐỊNH) */}
          <div className="space-y-6 lg:sticky lg:top-0 lg:h-fit self-start">
            <JobSidebarActions job={job} />
          </div>
        </div>
      </div>
    </div>
  );
}
