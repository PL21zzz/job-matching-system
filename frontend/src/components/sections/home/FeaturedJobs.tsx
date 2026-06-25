"use client";

import { getAccessibilityTags } from "@/src/lib/job-accessibility";
import { jobService } from "@/src/services/jobService";
import { useEffect, useMemo, useState } from "react";
import { JobCard } from "../../ui/JobCard";
import { SectionHeading } from "../../ui/SectionHeading";

type FeaturedTab = "newest" | "high-salary" | "remote";

export default function FeaturedJobs() {
  const [activeTab, setActiveTab] = useState<FeaturedTab>("newest");
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    jobService
      .getAllJobs()
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]));
  }, []);

  const filteredJobs = useMemo(() => {
    const normalized = [...jobs];

    if (activeTab === "remote") {
      return normalized.filter((job) => job.type === "REMOTE").slice(0, 4);
    }

    if (activeTab === "high-salary") {
      return normalized
        .sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
        .slice(0, 4);
    }

    return normalized
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 4);
  }, [activeTab, jobs]);

  if (filteredJobs.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-slate-100 bg-white py-16 transition-colors dark:border-white/5 dark:bg-secondary md:py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            title="Cơ hội việc làm nổi bật"
            description="Hiển thị trực tiếp từ dữ liệu việc làm hiện có trong hệ thống."
          />

          <div className="flex w-fit rounded-xl border border-slate-200/50 bg-slate-100 p-1.5 transition-colors dark:border-white/5 dark:bg-surface">
            {(["newest", "high-salary", "remote"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-slate-600 dark:text-gray-400"
                }`}
              >
                {tab === "newest"
                  ? "Mới nhất"
                  : tab === "high-salary"
                    ? "Lương cao"
                    : "Remote"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.employer?.companyName || "Doanh nghiệp đang cập nhật"}
              location={job.location}
              salary={job.salaryText || "Thương lượng"}
              type={job.type}
              tags={getAccessibilityTags(job.accessibilityFeatures).slice(0, 3)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
