"use client";

import { TableLayout } from "@/src/components/sections/admin/TableLayout";
import { adminService } from "@/src/services/adminService";
import { authService } from "@/src/services/authService";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  FolderTree,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

type AdminTab =
  | "employers"
  | "candidates"
  | "jobs"
  | "applications"
  | "categories"
  | "stories";

type DeleteType =
  | "employer"
  | "candidate"
  | "job"
  | "application"
  | "category"
  | "story";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalEmployers: 0,
    pendingEmployers: 0,
    openJobs: 0,
    totalApplications: 0,
    totalStories: 0,
  });

  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [actionId, setActionId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("employers");
  const [searchTerm, setSearchTerm] = useState("");

  const loadAdminData = async () => {
    try {
      setLoadingData(true);

      const [
        statsRes,
        employersRes,
        candidatesRes,
        jobsRes,
        appsRes,
        categoriesRes,
        storiesRes,
      ] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getAllEmployers().catch(() => []),
        adminService.getAllCandidates().catch(() => []),
        adminService.getAllJobs().catch(() => []),
        adminService.getAllApplications().catch(() => []),
        adminService.getAllCategories().catch(() => []),
        adminService.getAllStories().catch(() => []),
      ]);

      if (statsRes) {
        setStats({
          totalUsers: statsRes.totalUsers ?? 0,
          totalCandidates: statsRes.totalCandidates ?? 0,
          totalEmployers: statsRes.totalEmployers ?? 0,
          pendingEmployers: statsRes.pendingEmployers ?? 0,
          openJobs: statsRes.openJobs ?? 0,
          totalApplications: statsRes.totalApplications ?? 0,
          totalStories: statsRes.totalStories ?? 0,
        });
      }

      setEmployers(Array.isArray(employersRes) ? employersRes : []);
      setCandidates(Array.isArray(candidatesRes) ? candidatesRes : []);
      setJobs(Array.isArray(jobsRes) ? jobsRes : []);
      setApplications(Array.isArray(appsRes) ? appsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      setStories(Array.isArray(storiesRes) ? storiesRes : []);
    } catch {
      toast.error("Không thể tải dữ liệu quản trị.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    authService
      .getProfileMe()
      .then((user) => {
        const roleName = user?.role?.name || user?.role;

        if (roleName !== "Admin" && roleName !== "ADMIN") {
          toast.error("Bạn không có quyền truy cập trang quản trị.");
          router.replace("/");
          return;
        }

        setIsCheckingAuth(false);
        void loadAdminData();
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      setActionId("new-category");
      await adminService.createCategory(newCategoryName.trim());
      setNewCategoryName("");
      toast.success("Đã tạo danh mục mới.");
      await loadAdminData();
    } catch (error: any) {
      toast.error(
        typeof error === "string" ? error : "Tạo danh mục thất bại.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleEditCategory = async (id: number) => {
    const currentCategory = categories.find((item) => item.id === id);
    const name = window.prompt(
      "Nhập tên danh mục mới",
      currentCategory?.name || "",
    );

    if (!name || !name.trim()) return;

    try {
      setActionId(id);
      await adminService.updateCategory(id, name.trim());
      toast.success("Đã cập nhật danh mục.");
      await loadAdminData();
    } catch (error: any) {
      toast.error(
        typeof error === "string" ? error : "Cập nhật danh mục thất bại.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";

    try {
      setActionId(userId);
      await adminService.updateUserStatus(userId, nextStatus);
      toast.success(
        nextStatus === "BANNED"
          ? "Đã khóa tài khoản thành công."
          : "Đã mở khóa tài khoản.",
      );
      await loadAdminData();
    } catch {
      toast.error("Cập nhật trạng thái người dùng thất bại.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string | number, type: DeleteType) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${type} này không?`)) {
      return;
    }

    try {
      setActionId(id);

      if (type === "employer" || type === "candidate") {
        await adminService.deleteUser(String(id));
      } else if (type === "job") {
        await adminService.deleteJob(String(id));
      } else if (type === "application") {
        await adminService.deleteApplication(String(id));
      } else if (type === "story") {
        await adminService.deleteStory(String(id));
      } else {
        await adminService.deleteCategory(Number(id));
      }

      toast.success("Đã xử lý thao tác xóa.");
      await loadAdminData();
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : "Xóa dữ liệu thất bại.");
    } finally {
      setActionId(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEmployers = useMemo(
    () =>
      employers.filter((emp) =>
        [
          emp.fullName,
          emp.email,
          emp.employerProfile?.companyName,
          emp.employerProfile?.taxCode,
          emp.employerProfile?.address,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      ),
    [employers, normalizedSearch],
  );

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((cand) =>
        [
          cand.fullName,
          cand.email,
          cand.candidateProfile?.disabilityType?.name,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      ),
    [candidates, normalizedSearch],
  );

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        [job.title, job.location, job.employer?.companyName, job.category?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      ),
    [jobs, normalizedSearch],
  );

  const filteredApplications = useMemo(
    () =>
      applications.filter((app) =>
        [
          app.candidate?.user?.fullName,
          app.candidate?.user?.email,
          app.job?.title,
          app.job?.location,
          app.status,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      ),
    [applications, normalizedSearch],
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        String(category.name || "").toLowerCase().includes(normalizedSearch),
      ),
    [categories, normalizedSearch],
  );

  const filteredStories = useMemo(
    () =>
      stories.filter((story) =>
        [
          story.title,
          story.authorName,
          story.authorRole,
          story.status,
          story.author?.user?.email,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      ),
    [stories, normalizedSearch],
  );

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      key: "candidates",
      label: "Ứng viên",
      value: stats.totalCandidates,
      helper: `${stats.totalUsers} tài khoản toàn hệ thống`,
      icon: Users,
      tone: "bg-sky-600 text-white",
    },
    {
      key: "employers",
      label: "Doanh nghiệp",
      value: stats.totalEmployers,
      helper: `${stats.pendingEmployers} doanh nghiệp chờ duyệt`,
      icon: Building2,
      tone: "bg-amber-500 text-slate-950",
    },
    {
      key: "jobs",
      label: "Tin đang mở",
      value: stats.openJobs,
      helper: `${stats.totalApplications} đơn ứng tuyển đã nhận`,
      icon: BriefcaseBusiness,
      tone: "bg-emerald-600 text-white",
    },
    {
      key: "stories",
      label: "Bài viết cộng đồng",
      value: stats.totalStories,
      helper: "Quản lý nội dung truyền cảm hứng",
      icon: FileText,
      tone: "bg-fuchsia-600 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="border-b border-slate-200 bg-slate-900 px-4 py-4 text-white shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-fit text-lg font-bold tracking-tight"
          >
            Equitas Central Admin
          </button>

          <div className="flex w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 sm:w-80">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm dữ liệu quản trị..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">
              Quản trị hệ thống
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Bảng điều khiển Admin
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý người dùng, tin tuyển dụng, đơn ứng tuyển, danh mục và bài
              viết cộng đồng tại một nơi.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            disabled={loadingData}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold transition hover:bg-slate-100 disabled:opacity-60"
          >
            {loadingData ? "Đang nạp..." : "Làm mới dữ liệu"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveTab(card.key as AdminTab)}
              className={`overflow-hidden rounded-2xl text-left shadow-sm transition hover:scale-[1.01] ${card.tone}`}
            >
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] opacity-80">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-black">{card.value}</p>
                </div>
                <card.icon size={28} className="opacity-90" />
              </div>
              <div className="bg-black/10 px-5 py-3 text-xs font-semibold">
                {card.helper}
              </div>
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-4 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4">
            {[
              ["employers", `Doanh nghiệp (${filteredEmployers.length})`],
              ["candidates", `Ứng viên (${filteredCandidates.length})`],
              ["jobs", `Tin tuyển dụng (${filteredJobs.length})`],
              ["applications", `Đơn ứng tuyển (${filteredApplications.length})`],
              ["categories", `Danh mục (${filteredCategories.length})`],
              ["stories", `Bài viết (${filteredStories.length})`],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as AdminTab)}
                className={`shrink-0 border-b-2 px-2 py-4 text-xs font-bold uppercase transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-3">
            {activeTab === "categories" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nhập danh mục mới, ví dụ: Vệ sinh & Tạp vụ"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={actionId === "new-category"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
                  >
                    {actionId === "new-category" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Thêm danh mục
                  </button>
                </div>

                <TableLayout
                  data={filteredCategories}
                  headers={["ID", "Tên danh mục"]}
                  renderRow={(category) => (
                    <tr key={category.id} className="text-sm">
                      <td className="p-4 text-slate-500">{category.id}</td>
                      <td className="p-4 font-bold text-slate-900">
                        <div className="inline-flex items-center gap-2">
                          <FolderTree size={14} className="text-primary" />
                          {category.name}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category.id)}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                          >
                            Sửa
                          </button>
                          <button
                            disabled={actionId === category.id}
                            onClick={() => handleDelete(category.id, "category")}
                            className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            )}

            {activeTab === "employers" && (
              <TableLayout
                data={filteredEmployers}
                headers={[
                  "Doanh nghiệp",
                  "Email",
                  "Mã số thuế",
                  "Trạng thái",
                ]}
                renderRow={(emp) => (
                  <tr key={emp.id} className="text-sm">
                    <td className="p-4 font-bold text-slate-900">
                      {emp.employerProfile?.companyName || "Chưa cập nhật"}
                    </td>
                    <td className="p-4 text-slate-600">{emp.email}</td>
                    <td className="p-4 text-slate-500">
                      {emp.employerProfile?.taxCode || "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          emp.status === "BANNED"
                            ? "bg-red-50 text-red-600"
                            : emp.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          disabled={actionId !== null}
                          onClick={() => handleUpdateStatus(emp.id, emp.status)}
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-100"
                        >
                          {actionId === emp.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : emp.status === "BANNED" ? (
                            <span className="inline-flex items-center gap-1">
                              <UserCheck size={13} /> Mở khóa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <ShieldAlert size={13} /> Khóa
                            </span>
                          )}
                        </button>
                        <button
                          disabled={actionId === emp.id}
                          onClick={() => handleDelete(emp.id, "employer")}
                          className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}

            {activeTab === "candidates" && (
              <TableLayout
                data={filteredCandidates}
                headers={[
                  "Ứng viên",
                  "Email",
                  "Nhóm khuyết tật",
                  "Trạng thái",
                ]}
                renderRow={(cand) => (
                  <tr key={cand.id} className="text-sm">
                    <td className="p-4 font-bold text-slate-900">
                      {cand.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 text-slate-600">{cand.email}</td>
                    <td className="p-4 text-slate-500">
                      {cand.candidateProfile?.disabilityType?.name ||
                        "Chưa cập nhật"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          cand.status === "BANNED"
                            ? "bg-red-50 text-red-600"
                            : cand.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {cand.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          disabled={actionId !== null}
                          onClick={() => handleUpdateStatus(cand.id, cand.status)}
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-100"
                        >
                          {actionId === cand.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : cand.status === "BANNED" ? (
                            <span className="inline-flex items-center gap-1">
                              <UserCheck size={13} /> Mở khóa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <ShieldAlert size={13} /> Khóa
                            </span>
                          )}
                        </button>
                        <button
                          disabled={actionId === cand.id}
                          onClick={() => handleDelete(cand.id, "candidate")}
                          className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}

            {activeTab === "jobs" && (
              <TableLayout
                data={filteredJobs}
                headers={[
                  "Tiêu đề",
                  "Doanh nghiệp",
                  "Địa điểm",
                  "Trạng thái",
                ]}
                renderRow={(job) => (
                  <tr key={job.id} className="text-sm">
                    <td className="p-4 font-bold text-slate-900">{job.title}</td>
                    <td className="p-4 text-slate-600">
                      {job.employer?.companyName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">{job.location}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          job.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={actionId === job.id}
                        onClick={() => handleDelete(job.id, "job")}
                        className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )}
              />
            )}

            {activeTab === "applications" && (
              <TableLayout
                data={filteredApplications}
                headers={[
                  "Ứng viên",
                  "Vị trí",
                  "Match score",
                  "Trạng thái",
                ]}
                renderRow={(app) => (
                  <tr key={app.id} className="text-sm">
                    <td className="p-4 font-bold text-slate-900">
                      {app.candidate?.user?.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {app.job?.title || "N/A"}
                    </td>
                    <td className="p-4 font-bold text-primary">
                      {app.matchScore ? `${app.matchScore}%` : "Chưa có"}
                    </td>
                    <td className="p-4 text-slate-500">{app.status}</td>
                    <td className="p-4 text-right">
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleDelete(app.id, "application")}
                        className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )}
              />
            )}

            {activeTab === "stories" && (
              <TableLayout
                data={filteredStories}
                headers={[
                  "Tiêu đề",
                  "Tác giả hiển thị",
                  "Vai trò",
                  "Trạng thái",
                ]}
                renderRow={(story) => (
                  <tr key={story.id} className="text-sm">
                    <td className="p-4 font-bold text-slate-900">
                      {story.title || "Bài viết không tiêu đề"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {story.authorName || story.author?.user?.fullName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">
                      {story.authorRole || "Chưa cập nhật"}
                    </td>
                    <td className="p-4 text-slate-500">{story.status}</td>
                    <td className="p-4 text-right">
                      <button
                        disabled={actionId === story.id}
                        onClick={() => handleDelete(story.id, "story")}
                        className="rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
