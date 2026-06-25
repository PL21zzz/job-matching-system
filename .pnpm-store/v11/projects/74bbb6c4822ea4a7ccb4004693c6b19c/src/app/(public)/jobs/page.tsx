"use client";

import JobFilter from "@/src/components/sections/jobs/JobFilter";
import JobList from "@/src/components/sections/jobs/JobList";
import JobSearch from "@/src/components/sections/jobs/JobSearch";
import { DISABILITY_FOCUS_OPTIONS } from "@/src/constants/jobs";
import { getAccessibilityTags } from "@/src/lib/job-accessibility";
import { jobService } from "@/src/services/jobService";
import { useEffect, useState } from "react";

export default function JobListingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    categoryId: "",
    accessibility: "",
    disabilityFocus: "",
  });

  useEffect(() => {
    jobService
      .getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

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
          getAccessibilityTags(job.accessibilityFeatures).some((tag) =>
            tag.toLowerCase().includes(filters.accessibility.toLowerCase()),
          ),
        );
      }

      if (filters.disabilityFocus) {
        const focus = DISABILITY_FOCUS_OPTIONS.find(
          (option) => option.label === filters.disabilityFocus,
        );

        if (focus) {
          data = data.filter((job: any) => {
            const disabilityNames = Array.isArray(job.suitableDisabilities)
              ? job.suitableDisabilities.map((item: any) => item.name).join(" ")
              : "";
            const accessibilityText = getAccessibilityTags(
              job.accessibilityFeatures,
            ).join(" ");
            const haystack =
              `${accessibilityText} ${disabilityNames}`.toLowerCase();

            return focus.keywords.some((keyword) =>
              haystack.includes(keyword.toLowerCase()),
            );
          });
        }
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
      <JobSearch filters={filters} setFilters={setFilters} />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-3">
            <JobFilter
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />
          </div>

          <div className="lg:col-span-9">
            <JobList jobs={jobs} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
