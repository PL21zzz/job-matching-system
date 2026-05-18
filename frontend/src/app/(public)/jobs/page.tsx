"use client";

import JobFilter from "@/src/components/sections/jobs/JobFilter";
import JobList from "@/src/components/sections/jobs/JobList";
import JobSearch from "@/src/components/sections/jobs/JobSearch";

export default function JobListingPage() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-secondary text-slate-900 dark:text-white">
      {/* 1. Thanh tìm kiếm phía trên */}
      <JobSearch />

      {/* 2. Khu vực nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Bộ lọc bên trái (chiếm 3 cột) */}
          <div className="lg:col-span-3">
            <JobFilter />
          </div>

          {/* Danh sách việc làm bên phải (chiếm 9 cột) */}
          <div className="lg:col-span-9">
            <JobList />
          </div>
        </div>
      </main>
    </div>
  );
}
