"use client";

import JobFilter from "@/src/components/sections/jobs/JobFilter";
import JobList from "@/src/components/sections/jobs/JobList";
import JobSearch from "@/src/components/sections/jobs/JobSearch";
import { jobService } from "@/src/services/jobService";
import { useEffect, useState } from "react";

export default function JobListingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    categoryId: "",
    accessibility: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
      };

      let data = await jobService.getAllJobs(params);

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

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-secondary text-slate-900 dark:text-white">
      {/* 1. Thanh tìm kiếm phía trên */}
      <JobSearch filters={filters} setFilters={setFilters} />

      {/* 2. Khu vực nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-3">
            <JobFilter filters={filters} setFilters={setFilters} />
          </div>

          <div className="lg:col-span-9">
            <JobList jobs={jobs} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
