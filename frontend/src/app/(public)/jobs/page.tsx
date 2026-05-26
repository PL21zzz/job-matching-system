"use client";

import JobFilter from "@/src/components/sections/jobs/JobFilter";
import JobList from "@/src/components/sections/jobs/JobList";
import JobSearch from "@/src/components/sections/jobs/JobSearch";
import { jobService } from "@/src/services/jobService";
import { useEffect, useState } from "react";

export default function JobListingPage() {
  // Quản lý danh sách Job thật từ DB và trạng thái Loading của hệ thống
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quản lý trạng thái các tiêu chí bộ lọc (Gồm lọc cơ bản và đặc thù trợ năng)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    categoryId: "",
    accessibility: "", // Trợ năng đặc thù phục vụ người khuyết tật
  });

  // Hàm gọi API chuyên nghiệp qua tầng Service
  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Đóng gói tham số Query an toàn để gửi lên Backend
      const params = {
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
      };

      // Đón nhận dữ liệu sạch trực tiếp từ jobService (đã qua bóc tách xử lý lỗi ngầm)
      let data = await jobService.getAllJobs(params);

      // Xử lý bộ lọc đặc thù Trợ năng người khuyết tật (Accessibility Features) ở phía Client
      if (filters.accessibility) {
        data = data.filter((job: any) =>
          job.accessibilityFeatures
            ?.toLowerCase()
            .includes(filters.accessibility.toLowerCase()),
        );
      }

      setJobs(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cơ chế tự động gọi lại API bất cứ khi nào người dùng tương tác với bộ lọc
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-secondary text-slate-900 dark:text-white">
      {/* 1. Thanh tìm kiếm phía trên */}
      <JobSearch filters={filters} setFilters={setFilters} />

      {/* 2. Khu vực nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Bộ lọc trợ năng bên trái */}
          <div className="lg:col-span-3">
            <JobFilter filters={filters} setFilters={setFilters} />
          </div>

          {/* Danh sách việc làm render động bên phải */}
          <div className="lg:col-span-9">
            <JobList jobs={jobs} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
