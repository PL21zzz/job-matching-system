"use client";

import CandidateApplicationsList from "@/src/components/sections/employer/manageJobs/CandidateApplicationsList";
import JobPositionsList from "@/src/components/sections/employer/manageJobs/JobPositionsList";
import { jobService } from "@/src/services/jobService";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployerManageJobsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Gọi API bốc dữ liệu ứng tuyển thời gian thực từ cổng NestJS Docker Postgres
  const loadApplicationsData = async () => {
    try {
      setLoading(true);
      // Gọi hàm service (sẽ cấu hình ở Bước 4 bên dưới)
      const data = await jobService.getEmployerApplications();
      setApplications(data || []);

      // Mặc định chọn vị trí công việc đầu tiên nếu có dữ liệu
      if (data && data.length > 0) {
        const uniqueJobIds = Array.from(
          new Set(data.map((app: any) => app.job?.id)),
        );
        if (uniqueJobIds.length > 0) {
          setSelectedJobId(uniqueJobIds[0] as string);
        }
      }
    } catch (error) {
      console.error("Lỗi đồng bộ danh sách ứng tuyển:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicationsData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-white dark:bg-secondary flex flex-col items-center justify-center text-slate-900 dark:text-white gap-2 select-none">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-wider animate-pulse">
          Đang đồng bộ hồ sơ ứng tuyển...
        </p>
      </div>
    );
  }

  // Phân tách mảng danh sách Job duy nhất từ cụm Applications để đổ vào cột trái
  const uniqueJobs = applications.reduce((acc: any[], current: any) => {
    const x = acc.find((item) => item.id === current.job?.id);
    if (!x && current.job) {
      // Đếm số đơn ứng tuyển mới (APPLIED) tương ứng của Job này
      const newAppsCount = applications.filter(
        (app) => app.job?.id === current.job?.id && app.status === "APPLIED",
      ).length;
      return Object.assign(acc, [
        ...acc,
        { ...current.job, newCount: newAppsCount },
      ]);
    }
    return acc;
  }, []);

  // Lọc ra mảng các ứng viên nộp đơn tương ứng với Job đang được click chọn
  const filteredCandidates = applications.filter(
    (app) => app.job?.id === selectedJobId,
  );

  return (
    <div className="w-full min-h-screen bg-white dark:bg-secondary text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* HEADER SECTION BENTO STYLE */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
            Nhà tuyển dụng / Không gian quản lý
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Quản Lý Tiến Độ Tuyển Dụng
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
            Hệ thống tự động chấm điểm tương thích AI và bẻ lái kịch bản trợ
            năng công bằng.
          </p>
        </div>

        {/* 2-COLUMN MAIN BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (40%): DANH SÁCH TIN TUYỂN DỤNG */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-1">
              Tin tuyển dụng đã đăng ({uniqueJobs.length})
            </h2>
            <JobPositionsList
              jobs={uniqueJobs}
              selectedJobId={selectedJobId}
              onSelectJob={(id) => setSelectedJobId(id)}
            />
          </div>

          {/* CỘT PHẢI (60%): HỒ SƠ ỨNG VIÊN & DUYỆT ĐƠN */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-1">
              Ứng viên nộp đơn vị trí này ({filteredCandidates.length})
            </h2>
            <CandidateApplicationsList
              applications={filteredCandidates}
              onRefreshData={loadApplicationsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
