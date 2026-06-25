"use client";

import Card from "@/src/components/ui/Card";
import api from "@/src/lib/axios";
import { jobService } from "@/src/services/jobService";
import {
  Ban,
  CalendarDays,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

function formatDate(value?: string) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export default function EmployerManageJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(
    null,
  );
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadManageData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        jobService.getEmployerJobs(),
        jobService.getEmployerApplications(),
      ]);

      setJobs(jobsData || []);
      setApplications(applicationsData || []);

      if (jobsData?.length > 0) {
        const firstJobId = jobsData[0].id;
        setSelectedJobId((current) => current || firstJobId);
      } else {
        setSelectedJobId(null);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu quản lý tuyển dụng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManageData();
  }, []);

  const applicationsByJobId = useMemo(() => {
    return applications.reduce<Record<string, any[]>>((acc, item) => {
      const jobId = item.job?.id;
      if (!jobId) return acc;
      acc[jobId] = [...(acc[jobId] || []), item];
      return acc;
    }, {});
  }, [applications]);

  const jobsWithCounts = useMemo(
    () =>
      jobs.map((job) => {
        const jobApplications = applicationsByJobId[job.id] || [];
        const newCount = jobApplications.filter(
          (item) => item.status === "APPLIED",
        ).length;

        return {
          ...job,
          applicationsCount:
            job._count?.applications ?? jobApplications.length ?? 0,
          newCount,
        };
      }),
    [applicationsByJobId, jobs],
  );

  const selectedJobApplications = selectedJobId
    ? applicationsByJobId[selectedJobId] || []
    : [];

  const selectedApplication =
    selectedJobApplications.find((item) => item.id === selectedApplicationId) ||
    null;

  useEffect(() => {
    if (!selectedJobId) {
      setSelectedApplicationId(null);
      return;
    }

    const items = applicationsByJobId[selectedJobId] || [];
    const stillExists = items.some((item) => item.id === selectedApplicationId);

    if (!stillExists) {
      setSelectedApplicationId(null);
    }
  }, [applicationsByJobId, selectedApplicationId, selectedJobId]);

  const handleUpdateStatus = async (
    applicationId: string,
    nextStatus: "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED",
  ) => {
    try {
      setActionLoadingId(applicationId);
      await api.patch(`/jobs/applications/${applicationId}/status`, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === "REJECTED"
          ? "Đã từ chối hồ sơ."
          : nextStatus === "REVIEWING"
            ? "Đã tiếp nhận hồ sơ."
            : nextStatus === "INTERVIEW"
              ? "Đã chuyển sang vòng phỏng vấn."
              : "Đã chấp nhận ứng viên.",
      );

      loadManageData();
    } catch (error: any) {
      toast.error(
        typeof error === "string" ? error : "Không thể xử lý hành động này.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 bg-white text-slate-900 select-none dark:bg-secondary dark:text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="animate-pulse text-xs font-bold uppercase tracking-wider">
          Đang đồng bộ hồ sơ ứng tuyển...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 transition-colors duration-300 dark:bg-secondary dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Nhà tuyển dụng / Không gian quản lý
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Quản lý tiến độ tuyển dụng
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
            Theo dõi từng tin tuyển dụng, số lượng ứng viên và mở chi tiết hồ sơ
            khi cần.
          </p>
        </div>

        {jobsWithCounts.length === 0 ? (
          <Card layoutClassName="p-12 text-center rounded-3xl">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Bạn chưa có tin tuyển dụng nào. Hãy tạo tin mới để bắt đầu nhận hồ
              sơ ứng viên.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Tin tuyển dụng đã đăng ({jobsWithCounts.length})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {jobsWithCounts.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={`cursor-pointer rounded-3xl text-left transition-all ${
                    selectedJobId === job.id
                      ? "ring-2 ring-primary"
                      : "hover:-translate-y-0.5"
                  }`}
                >
                  <Card layoutClassName="rounded-3xl p-5 space-y-4 bg-slate-50 dark:bg-surface">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
                          {job.status}
                        </span>
                        <h3 className="line-clamp-2 text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                          {job.title}
                        </h3>
                      </div>

                      {job.newCount > 0 ? (
                        <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                          {job.newCount} đơn mới
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-3 text-[11px] font-bold text-slate-500 dark:border-white/5 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={13} /> {job.applicationsCount} ứng viên
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} /> Cập nhật tin:{" "}
                        {formatDate(job.updatedAt)}
                      </span>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedJobId && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-surface">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Ứng viên của vị trí này
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedJobApplications.length > 0
                    ? `Đang có ${selectedJobApplications.length} hồ sơ. Bấm “Xem chi tiết” để mở modal từng ứng viên.`
                    : "Tin này hiện chưa có ai ứng tuyển."}
                </p>
              </div>
            </div>

            {selectedJobApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                Chưa có hồ sơ ứng tuyển cho tin này.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedJobApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-secondary md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black uppercase text-slate-900 dark:text-white">
                          {app.candidate?.user?.fullName || "Ứng viên ẩn danh"}
                        </p>
                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
                          {app.status}
                        </span>
                        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                          Match {app.matchScore ?? 0}%
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Mail size={12} /> {app.candidate?.user?.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedApplicationId(app.id)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedApplicationId(null)}
        >
          <div
            className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/5 p-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    {selectedApplication.candidate?.user?.fullName ||
                      "Ứng viên ẩn danh"}
                  </h3>
                  <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
                    {selectedApplication.status}
                  </span>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    MATCH {selectedApplication.matchScore ?? 0}%
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Mail size={14} />
                  {selectedApplication.candidate?.user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicationId(null)}
                className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Thư ứng tuyển
                  </p>
                  <div className="max-h-[320px] overflow-y-auto rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-300">
                    {selectedApplication.coverLetter ||
                      "Ứng viên không đính kèm thư ứng tuyển."}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-950/30 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-xl bg-white/5 p-2.5 text-slate-400">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-tight text-slate-200">
                        Hồ sơ CV ứng viên đính kèm
                      </p>
                      <p className="mt-0.5 text-[9px] font-bold uppercase text-slate-500">
                        Định dạng tệp tin: PDF/DOCX
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedApplication?.cvUrl) {
                        window.open(selectedApplication.cvUrl, "_blank");
                      } else {
                        toast.error("Không tìm thấy file CV của ứng viên này.");
                      }
                    }}
                    className="shrink-0 rounded-xl border border-dashed border-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300 transition hover:border-primary hover:text-primary"
                  >
                    Xem bản cứng
                  </button>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/20 p-5">
                <p className="text-sm font-black uppercase tracking-wider text-white">
                  Xử lý hồ sơ
                </p>

                <p className="text-xs leading-relaxed text-slate-400">
                  Bạn có thể tiếp nhận, chuyển vòng phỏng vấn, chấp nhận hoặc từ
                  chối hồ sơ trực tiếp trong modal này.
                </p>

                {selectedApplication.status !== "ACCEPTED" &&
                selectedApplication.status !== "REJECTED" ? (
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      disabled={actionLoadingId !== null}
                      onClick={() =>
                        handleUpdateStatus(selectedApplication.id, "REJECTED")
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-rose-400 transition hover:bg-rose-500/10"
                    >
                      {actionLoadingId === selectedApplication.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Ban size={14} />
                      )}
                      Từ chối hồ sơ
                    </button>

                    {selectedApplication.status === "APPLIED" && (
                      <button
                        type="button"
                        disabled={actionLoadingId !== null}
                        onClick={() =>
                          handleUpdateStatus(selectedApplication.id, "REVIEWING")
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-primary-hover"
                      >
                        {actionLoadingId === selectedApplication.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck size={14} />
                        )}
                        Tiếp nhận hồ sơ
                      </button>
                    )}

                    {selectedApplication.status === "REVIEWING" && (
                      <button
                        type="button"
                        disabled={actionLoadingId !== null}
                        onClick={() =>
                          handleUpdateStatus(selectedApplication.id, "INTERVIEW")
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-blue-700"
                      >
                        {actionLoadingId === selectedApplication.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        Mời phỏng vấn
                      </button>
                    )}

                    {selectedApplication.status === "INTERVIEW" && (
                      <button
                        type="button"
                        disabled={actionLoadingId !== null}
                        onClick={() =>
                          handleUpdateStatus(selectedApplication.id, "ACCEPTED")
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-emerald-700"
                      >
                        {actionLoadingId === selectedApplication.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck size={14} />
                        )}
                        Chấp nhận ứng viên
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl p-4 text-xs font-black uppercase tracking-wider ${
                      selectedApplication.status === "ACCEPTED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {selectedApplication.status === "ACCEPTED"
                      ? "Hồ sơ đã được chấp nhận."
                      : "Hồ sơ đã bị từ chối."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
