"use client";
import { useState } from "react";
import { JobCard } from "../../ui/JobCard";
import { SectionHeading } from "../../ui/SectionHeading";

export default function FeaturedJobs() {
  const [activeTab, setActiveTab] = useState<
    "newest" | "high-salary" | "remote"
  >("newest");

  const mockJobs = [
    {
      id: "1",
      title: "Frontend Developer (ReactJS)",
      company: "Novaha Lab",
      location: "Đà Nẵng",
      salary: "15 - 25 Triệu",
      type: "Full-time",
      category: "newest",
      tags: ["Remote", "Lối đi xe lăn"],
    },
    {
      id: "2",
      title: "UI/UX Designer",
      company: "Equitas Tech",
      location: "Hồ Chí Minh",
      salary: "18 - 30 Triệu",
      type: "Full-time",
      category: "high-salary",
      tags: ["Linh hoạt", "Trình đọc màn hình"],
    },
    {
      id: "3",
      title: "AI Trainer",
      company: "Inclusive AI",
      location: "Hà Nội",
      salary: "10 - 15 Triệu",
      type: "Remote",
      category: "remote",
      tags: ["Remote 100%", "Ngôn ngữ ký hiệu"],
    },
  ];

  const filteredJobs = mockJobs.filter((job) => job.category === activeTab);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-secondary transition-colors border-y border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="Cơ Hội Việc Làm Nổi Bật"
            description="Các công việc chất lượng cao, thân thiện với người khuyết tật."
          />

          <div className="flex bg-slate-100 dark:bg-surface p-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 transition-colors w-fit">
            {(["newest", "high-salary", "remote"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab ? "bg-primary text-primary-foreground shadow-md" : "text-slate-600 dark:text-gray-400"}`}
              >
                {tab === "newest"
                  ? "Mới Nhất"
                  : tab === "high-salary"
                    ? "Lương Cao"
                    : "Việc Làm Remote"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
}
