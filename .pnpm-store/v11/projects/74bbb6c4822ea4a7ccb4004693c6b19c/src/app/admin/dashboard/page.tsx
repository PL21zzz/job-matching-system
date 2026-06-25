"use client";

import { TableLayout } from "@/src/components/sections/admin/TableLayout";
import { adminService } from "@/src/services/adminService";
import { authService } from "@/src/services/authService";
import {
  Edit,
  FolderTree,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

type AdminTab =
  | "employers"
  | "candidates"
  | "jobs"
  | "applications"
  | "categories";
type DeleteType =
  | "employer"
  | "candidate"
  | "job"
  | "application"
  | "category";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingEmployers: 0,
    openJobs: 0,
    rejectedApplications: 0,
  });
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
      ] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getAllEmployers().catch(() => []),
        adminService.getAllCandidates().catch(() => []),
        adminService.getAllJobs().catch(() => []),
        adminService.getAllApplications().catch(() => []),
        adminService.getAllCategories().catch(() => []),
      ]);

      if (statsRes) {
        setStats({
          totalCandidates: statsRes.totalCandidates ?? 0,
          pendingEmployers: statsRes.pendingEmployers ?? 0,
          openJobs: statsRes.openJobs ?? 0,
          rejectedApplications: statsRes.rejectedApplications ?? 0,
        });
      }

      setEmployers(Array.isArray(employersRes) ? employersRes : []);
      setCandidates(Array.isArray(candidatesRes) ? candidatesRes : []);
      setJobs(Array.isArray(jobsRes) ? jobsRes : []);
      setApplications(Array.isArray(appsRes) ? appsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
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
        loadAdminData();
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleEdit = async (id: string | number, type: string) => {
    if (type !== "category") {
      toast.success(`Chức năng chỉnh sửa ${type} sẽ làm tiếp sau.`);
      return;
    }

    const currentCategory = categories.find((item) => item.id === id);
    const name = window.prompt(
      "Nhập tên category mới",
      currentCategory?.name || "",
    );

    if (!name || !name.trim()) return;

    try {
      setActionId(id);
      await adminService.updateCategory(Number(id), name.trim());
      toast.success("Đã cập nhật category.");
      loadAdminData();
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : "Sửa category thất bại.");
    } finally {
      setActionId(null);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Vui lòng nhập tên category.");
      return;
    }

    try {
      setActionId("new-category");
      await adminService.createCategory(newCategoryName.trim());
      setNewCategoryName("");
      toast.success("Đã tạo category mới.");
      loadAdminData();
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : "Tạo category thất bại.");
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
      loadAdminData();
    } catch {
      toast.error("Cập nhật trạng thái người dùng thất bại.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string | number, type: DeleteType) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${type} này khỏi hệ thống?`)) {
      return;
    }

    try {
      setActionId(id);

      if (type === "employer" || type === "candidate") {
        await adminService.deleteUser(String(id));
        toast.success(
          type === "employer"
            ? "Đã xóa tài khoản nhà tuyển dụng và dữ liệu liên quan."
            : "Đã xóa tài khoản ứng viên và dữ liệu liên quan.",
        );
      } else if (type === "job") {
        await adminService.deleteJob(String(id));
        toast.success("Đã xóa tin tuyển dụng.");
      } else if (type === "application") {
        await adminService.deleteApplication(String(id));
        toast.success("Đã xóa đơn ứng tuyển.");
      } else {
        await adminService.deleteCategory(Number(id));
        toast.success("Đã xóa category.");
      }

      loadAdminData();
    } catch (error: any) {
      toast.error(
        typeof error === "string" ? error : "Thao tác xóa thất bại.",
      );
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

  const filteredApps = useMemo(
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

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 bg-[#f8f9fa] text-slate-600">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Đang kiểm tra quyền truy cập quản trị...
        </p>
      </div>
    );
  }

  const statCardClass =
    "h-28 cursor-pointer overflow-hidden rounded-md shadow-xs transition";

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] font-sans text-slate-800">
      <nav className="flex w-full flex-col gap-3 bg-[#343a40] px-4 py-3 text-white shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-fit cursor-pointer text-lg font-bold uppercase text-slate-200 transition-colors hover:text-white"
        >
          Equitas Central Admin
        </button>

        <div className="flex w-full items-center gap-2 rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 sm:w-72">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-white outline-hidden"
          />
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-normal tracking-tight text-slate-900">
            Dashboard Admin
          </h1>

          <button
            onClick={loadAdminData}
            disabled={loadingData}
            className="rounded-md border bg-white px-4 py-2 text-xs font-bold transition hover:bg-slate-50 disabled:opacity-50"
          >
            {loadingData ? "Đang nạp..." : "Làm mới dữ liệu"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div
            onClick={() => setActiveTab("candidates")}
            className={`${statCardClass} ${
              activeTab === "candidates"
                ? "scale-[1.02] bg-[#0056b3] text-white"
                : "bg-[#007bff] text-white"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tổng ứng viên
              </span>
              <span className="text-2xl font-black">{stats.totalCandidates}</span>
            </div>
            <div className="flex items-center justify-between bg-black/10 px-4 py-2 text-[11px] font-medium">
              <span>Xem danh sách</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("employers")}
            className={`${statCardClass} ${
              activeTab === "employers"
                ? "bg-[#d39e00] text-slate-950"
                : "bg-[#ffc107] text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Nhà tuyển dụng
              </span>
              <span className="text-2xl font-black">{employers.length}</span>
            </div>
            <div className="flex items-center justify-between bg-black/5 px-4 py-2 text-[11px] font-medium">
              <span>Xem danh sách</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("jobs")}
            className={`${statCardClass} ${
              activeTab === "jobs"
                ? "scale-[1.02] bg-[#1e7e34] text-white"
                : "bg-[#28a745] text-white"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tin tuyển dụng mở
              </span>
              <span className="text-2xl font-black">{stats.openJobs}</span>
            </div>
            <div className="flex items-center justify-between bg-black/10 px-4 py-2 text-[11px] font-medium">
              <span>Kiểm tra hệ thống</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("applications")}
            className={`${statCardClass} ${
              activeTab === "applications"
                ? "scale-[1.02] bg-[#bd2130] text-white"
                : "bg-[#dc3545] text-white"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Đơn ứng tuyển
              </span>
              <span className="text-2xl font-black">{applications.length}</span>
            </div>
            <div className="flex items-center justify-between bg-black/10 px-4 py-2 text-[11px] font-medium">
              <span>Giám sát luồng nộp</span>
              <span>→</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
          <div className="flex gap-4 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4">
            {[
              ["employers", `Doanh nghiệp (${filteredEmployers.length})`],
              ["candidates", `Ứng viên (${filteredCandidates.length})`],
              ["jobs", `Tin tuyển dụng (${filteredJobs.length})`],
              ["applications", `Đơn ứng tuyển (${filteredApps.length})`],
              ["categories", `Category (${filteredCategories.length})`],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as AdminTab)}
                className={`shrink-0 border-b-2 px-2 py-3.5 text-xs font-bold uppercase transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-2">
            {activeTab === "categories" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nhập category mới, ví dụ: Vệ sinh & Tạp vụ"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-primary"
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
                    Thêm category
                  </button>
                </div>

                <TableLayout
                  data={filteredCategories}
                  headers={["ID", "Tên category"]}
                  renderRow={(category) => (
                    <tr
                      key={category.id}
                      className="text-xs font-medium text-slate-700 transition hover:bg-slate-50/50"
                    >
                      <td className="p-4 font-mono text-slate-500">
                        {category.id}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        <div className="inline-flex items-center gap-2">
                          <FolderTree size={14} className="text-primary" />
                          {category.name}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleEdit(category.id, "category")}
                            className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 transition hover:bg-slate-200"
                            title="Sửa category"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            disabled={actionId === category.id}
                            onClick={() => handleDelete(category.id, "category")}
                            className="cursor-pointer rounded-md border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                            title="Xóa category"
                          >
                            {actionId === category.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
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
                  "Tên doanh nghiệp",
                  "Mã số thuế",
                  "Địa chỉ văn phòng",
                  "Trạng thái",
                ]}
                renderRow={(emp) => (
                  <tr
                    key={emp.id}
                    className="text-xs font-medium text-slate-700 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold uppercase text-slate-950">
                      {emp.employerProfile?.companyName || "Chưa cập nhật"}
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {emp.employerProfile?.taxCode || "N/A"}
                    </td>
                    <td className="max-w-xs truncate p-4 text-slate-600">
                      {emp.employerProfile?.address || "N/A"}
                    </td>
                    <td className="p-4">
                      {emp.status === "BANNED" ? (
                        <span className="font-bold uppercase text-red-500">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="font-bold uppercase text-emerald-600">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          disabled={actionId !== null}
                          onClick={() => handleUpdateStatus(emp.id, emp.status)}
                          className={`cursor-pointer rounded-md border p-1.5 transition ${
                            emp.status === "BANNED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : "border-orange-200 bg-orange-50 text-orange-600"
                          }`}
                          title={
                            emp.status === "BANNED"
                              ? "Mở khóa nhà tuyển dụng"
                              : "Khóa nhà tuyển dụng"
                          }
                        >
                          {actionId === emp.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : emp.status === "BANNED" ? (
                            <UserCheck size={13} />
                          ) : (
                            <ShieldAlert size={13} />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(emp.id, "employer")}
                          className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 transition hover:bg-slate-200"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          disabled={actionId === emp.id}
                          onClick={() => handleDelete(emp.id, "employer")}
                          className="cursor-pointer rounded-md border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                          title="Xóa tài khoản nhà tuyển dụng"
                        >
                          {actionId === emp.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
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
                  "Tên ứng viên",
                  "Email hệ thống",
                  "Loại khuyết tật",
                  "Trạng thái",
                ]}
                renderRow={(cand) => (
                  <tr
                    key={cand.id}
                    className="text-xs font-medium text-slate-700 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-950">
                      {cand.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 font-mono text-slate-500">{cand.email}</td>
                    <td className="p-4 font-semibold text-slate-600">
                      {cand.candidateProfile?.disabilityType?.name ||
                        "Chưa cập nhật"}
                    </td>
                    <td className="p-4">
                      {cand.status === "BANNED" ? (
                        <span className="font-bold uppercase text-red-500">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="font-bold uppercase text-emerald-600">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          disabled={actionId !== null}
                          onClick={() => handleUpdateStatus(cand.id, cand.status)}
                          className={`cursor-pointer rounded-md border p-1.5 transition ${
                            cand.status === "BANNED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : "border-orange-200 bg-orange-50 text-orange-600"
                          }`}
                          title={
                            cand.status === "BANNED"
                              ? "Mở khóa ứng viên"
                              : "Khóa ứng viên"
                          }
                        >
                          {actionId === cand.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : cand.status === "BANNED" ? (
                            <UserCheck size={13} />
                          ) : (
                            <ShieldAlert size={13} />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(cand.id, "candidate")}
                          className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 transition hover:bg-slate-200"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          disabled={actionId === cand.id}
                          onClick={() => handleDelete(cand.id, "candidate")}
                          className="cursor-pointer rounded-md border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                          title="Xóa tài khoản ứng viên"
                        >
                          {actionId === cand.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
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
                  "Tiêu đề tin",
                  "Công ty đăng",
                  "Địa điểm",
                  "Trạng thái",
                ]}
                renderRow={(job) => (
                  <tr
                    key={job.id}
                    className="text-xs font-medium text-slate-700 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-950">{job.title}</td>
                    <td className="p-4 font-semibold uppercase text-slate-600">
                      {job.employer?.companyName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">{job.location}</td>
                    <td className="p-4">
                      {job.status === "OPEN" ? (
                        <span className="font-bold text-emerald-600">
                          MỞ PUBLIC
                        </span>
                      ) : (
                        <span className="font-bold text-slate-400">ĐÃ ĐÓNG</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => handleEdit(job.id, "job")}
                          className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 transition hover:bg-slate-200"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          disabled={actionId === job.id}
                          onClick={() => handleDelete(job.id, "job")}
                          className="cursor-pointer rounded-md border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                          title="Xóa tin tuyển dụng"
                        >
                          {actionId === job.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}

            {activeTab === "applications" && (
              <TableLayout
                data={filteredApps}
                headers={[
                  "Ứng viên nộp đơn",
                  "Vị trí tuyển dụng",
                  "Độ tương thích AI",
                  "Trạng thái đơn",
                ]}
                renderRow={(app) => (
                  <tr
                    key={app.id}
                    className="text-xs font-medium text-slate-700 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-950">
                      {app.candidate?.user?.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 font-bold text-slate-600">
                      {app.job?.title || "N/A"}
                    </td>
                    <td className="p-4 font-mono text-sm font-bold text-blue-600">
                      {app.matchScore ? `${app.matchScore}%` : "Chưa có"}
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleDelete(app.id, "application")}
                        className="cursor-pointer rounded-md border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                        title="Xóa đơn ứng tuyển"
                      >
                        {actionId === app.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
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
