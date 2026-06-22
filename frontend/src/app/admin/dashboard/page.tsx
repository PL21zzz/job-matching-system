"use client";

import { TableLayout } from "@/src/components/sections/admin/TableLayout";
import { adminService } from "@/src/services/adminService";
import { jwtDecode } from "jwt-decode";
import {
  Edit,
  Loader2,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const router = useRouter();

  // 1. Quản lý State Dữ liệu hệ thống
  const [stats, setStats] = useState<any>({
    totalCandidates: 0,
    pendingEmployers: 0,
    openJobs: 0,
    rejectedApplications: 0,
  });
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // 2. Quản lý State Trạng thái UI
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "employers" | "candidates" | "jobs" | "applications"
  >("employers");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🚀 BƯỚC 1: ROUTE GUARD CHẶN TUYỆT ĐỐI THEO TOKEN VÀ CHECK ROLE THẬT TỪ JWT DECODE
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      toast.error("Vui lòng đăng nhập tài khoản Quản trị!");
      router.push("/login");
      return;
    }

    try {
      // 🌟 GIẢI MÃ TOKEN ĐỂ KIỂM TRA QUYỀN THỜI GIAN THỰC (CHỐNG PHÁ HOẠI ROUTE)
      const decodedUser: any = jwtDecode(token);
      const roleName = decodedUser.role?.name || decodedUser.role;

      if (roleName !== "Admin" && roleName !== "ADMIN") {
        toast.error(
          "Quyền truy cập bị từ chối! Vui lòng dùng tài khoản Admin.",
        );
        router.push("/login");
      } else {
        // Đúng là cấu trúc quyền Admin tối cao -> Mở cổng giao diện và bốc DB
        setIsCheckingAuth(false);
        loadAdminData();
      }
    } catch (e) {
      console.error("Token dính lỗi cấu trúc giải mã:", e);
      localStorage.removeItem("access_token");
      router.push("/login");
    }
  }, [router]);

  // ⚙️ BƯỚC 2: HÀM CÀO DỮ LIỆU ĐỒNG BỘ MẢNG PHẲNG TỪ BACKEND
  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      console.log("=== BẮT ĐẦU KÍCH HOẠT GỌI API ADMIN ===");

      const [statsRes, employersRes, candidatesRes, jobsRes, appsRes] =
        await Promise.all([
          adminService.getDashboardStats().catch((err) => {
            console.error("Lỗi stats:", err);
            return null;
          }),
          adminService.getAllEmployers().catch((err) => {
            console.error("Lỗi employers:", err);
            return [];
          }),
          adminService.getAllCandidates().catch((err) => {
            console.error("Lỗi candidates:", err);
            return [];
          }),
          adminService.getAllJobs().catch((err) => {
            console.error("Lỗi jobs:", err);
            return [];
          }),
          adminService.getAllApplications().catch((err) => {
            console.error("Lỗi applications:", err);
            return [];
          }),
        ]);

      if (statsRes) setStats(statsRes);

      setEmployers(Array.isArray(employersRes) ? employersRes : []);
      setCandidates(Array.isArray(candidatesRes) ? candidatesRes : []);
      setJobs(Array.isArray(jobsRes) ? jobsRes : []);
      setApplications(Array.isArray(appsRes) ? appsRes : []);
    } catch (error) {
      console.error("Lỗi tổng trong block try-catch:", error);
      toast.error("Không thể kết nối cổng dữ liệu Admin.");
    } finally {
      setLoadingData(false);
      console.log("=== KẾT THÚC TIẾN TRÌNH CALL DATA ===");
    }
  };

  // 🛠️ BƯỚC 3: CÁC HÀM XỬ LÝ SỰ KIỆN NÚT HÀNH ĐỘNG (CRUD/ACTIVE/BAN)
  const handleEdit = (id: string, type: string) => {
    toast.success(`Mở Modal chỉnh sửa cấu trúc cho ${type} ID: ${id}`);
  };

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
    try {
      setActionId(userId);
      await adminService.updateUserStatus(userId, nextStatus);
      toast.success(
        nextStatus === "BANNED"
          ? "Đã khóa tài khoản thành công!"
          : "Đã mở khóa tài khoản.",
      );
      loadAdminData();
    } catch (error) {
      toast.error("Cập nhật trạng thái người dùng thất bại.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (
    id: string,
    type: "employer" | "candidate" | "job" | "application",
  ) => {
    if (
      !confirm(`Bạn có chắc chắn muốn xóa dữ liệu ${type} này khỏi hệ thống?`)
    )
      return;

    try {
      setActionId(id);
      if (type === "job") {
        await adminService.deleteJob(id);
        toast.success("Đã gỡ bỏ tin tuyển dụng thành công!");
      } else if (type === "application") {
        await adminService.deleteApplication(id);
        toast.success("Đã xóa bản ghi đơn ứng tuyển khỏi hệ thống giám sát.");
      } else {
        toast.error(
          `Tính năng xóa User (${type}) cần xử lý Cascade khóa ngoại ở DB, nên ưu tiên dùng nút Khóa tài khoản!`,
        );
        return;
      }
      loadAdminData();
    } catch (error) {
      toast.error("Thao tác xóa thất bại.");
    } finally {
      setActionId(null);
    }
  };

  // 🔍 BỘ LỌC TÌM KIẾM NHANH DỮ LIỆU TRÊN CÁC TAB
  const filteredEmployers = employers.filter((emp) =>
    emp.employerProfile?.companyName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const filteredCandidates = candidates.filter(
    (cand) =>
      cand.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const filteredApps = applications.filter(
    (app) =>
      app.candidate?.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-slate-600 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Đang kiểm tra quyền truy cập Quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] font-sans text-slate-800">
      {/* HEADER TOPBAR */}
      <nav className="w-full bg-[#343a40] text-white px-6 py-3 flex items-center justify-between shadow-xs select-none">
        {/* 🌟 FIX ĐIỀU HƯỚNG: Click vào chữ Equitas Central Admin tự động nhảy về trang chủ / */}
        <span
          onClick={() => router.push("/")}
          className="font-bold text-lg uppercase text-slate-200 cursor-pointer hover:text-white transition-colors"
        >
          Equitas Central Admin
        </span>
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-md px-3 py-1.5 border border-slate-600 w-64">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-white w-full outline-hidden"
          />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-normal text-slate-900 tracking-tight">
            Dashboard Portal
          </h1>
          <button
            onClick={loadAdminData}
            disabled={loadingData}
            className="bg-white hover:bg-slate-50 border text-xs font-bold px-4 py-2 rounded-md transition disabled:opacity-50 select-none cursor-pointer"
          >
            {loadingData ? "Đang nạp..." : "Làm mới dữ liệu 🔄"}
          </button>
        </div>

        {/* 4 KHỐI THẺ MÀU THỐNG KÊ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
          <div
            onClick={() => setActiveTab("candidates")}
            className={`text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 cursor-pointer transition ${activeTab === "candidates" ? "bg-[#0056b3] scale-102" : "bg-[#007bff]"}`}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tổng ứng viên
              </span>
              <span className="text-2xl font-black">
                {stats.totalCandidates}
              </span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between">
              <span>Xem danh sách</span> ➔
            </div>
          </div>

          <div
            onClick={() => setActiveTab("employers")}
            className={`rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 cursor-pointer transition ${activeTab === "employers" ? "bg-[#d39e00] text-slate-950" : "bg-[#ffc107] text-slate-900"}`}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Quản lý doanh nghiệp
              </span>
              <span className="text-2xl font-black">{employers.length}</span>
            </div>
            <div className="bg-black/5 px-4 py-2 text-[11px] font-medium flex items-center justify-between">
              <span>Xem danh sách</span> ➔
            </div>
          </div>

          <div
            onClick={() => setActiveTab("jobs")}
            className={`text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 cursor-pointer transition ${activeTab === "jobs" ? "bg-[#1e7e34] scale-102" : "bg-[#28a745]"}`}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tin tuyển dụng mở
              </span>
              <span className="text-2xl font-black">{stats.openJobs}</span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between">
              <span>Kiểm tra hệ thống</span> ➔
            </div>
          </div>

          <div
            onClick={() => setActiveTab("applications")}
            className={`text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 cursor-pointer transition ${activeTab === "applications" ? "bg-[#bd2130] scale-102" : "bg-[#dc3545]"}`}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Đơn ứng tuyển
              </span>
              <span className="text-2xl font-black">{applications.length}</span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between">
              <span>Giám sát luồng nộp</span> ➔
            </div>
          </div>
        </div>

        {/* BẢNG HỆ THỐNG PHÂN TAB */}
        <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-4 border-b border-slate-200 flex gap-4 overflow-x-auto select-none">
            <button
              onClick={() => setActiveTab("employers")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 shrink-0 transition-colors ${activeTab === "employers" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Doanh nghiệp ({filteredEmployers.length})
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 shrink-0 transition-colors ${activeTab === "candidates" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Ứng viên ({filteredCandidates.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 shrink-0 transition-colors ${activeTab === "jobs" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Tin tuyển dụng ({filteredJobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 shrink-0 transition-colors ${activeTab === "applications" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Đơn ứng tuyển ({filteredApps.length})
            </button>
          </div>

          <div className="p-2">
            {/* 1. TAB DOANH NGHIỆP */}
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
                    className="hover:bg-slate-50/50 transition text-xs font-medium text-slate-700"
                  >
                    <td className="p-4 font-bold text-slate-950 uppercase">
                      {emp.employerProfile?.companyName || "Chưa cập nhật"}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {emp.employerProfile?.taxCode || "N/A"}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {emp.employerProfile?.address || "N/A"}
                    </td>
                    <td className="p-4">
                      {emp.status === "BANNED" ? (
                        <span className="text-red-500 font-bold uppercase">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold uppercase">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          disabled={actionId !== null}
                          onClick={() => handleUpdateStatus(emp.id, emp.status)}
                          className={`p-1.5 rounded-md border transition cursor-pointer ${emp.status === "BANNED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-orange-50 text-orange-600 border-orange-200"}`}
                          title={
                            emp.status === "BANNED"
                              ? "Mở khóa đối tác"
                              : "Khóa tài khoản"
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
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-md transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}

            {/* 2. TAB ỨNG VIÊN */}
            {activeTab === "candidates" && (
              <TableLayout
                data={filteredCandidates}
                headers={[
                  "Tên Ứng viên",
                  "Email hệ thống",
                  "Loại khuyết tật",
                  "Trạng thái",
                ]}
                renderRow={(cand) => (
                  <tr
                    key={cand.id}
                    className="hover:bg-slate-50/50 transition text-xs font-medium text-slate-700"
                  >
                    <td className="p-4 font-bold text-slate-950">
                      {cand.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {cand.email}
                    </td>
                    <td className="p-4 font-semibold text-slate-600">
                      {cand.candidateProfile?.disabilityType?.name ||
                        "Chưa cập nhật"}
                    </td>
                    <td className="p-4">
                      {cand.status === "BANNED" ? (
                        <span className="text-red-500 font-bold uppercase">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold uppercase">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          disabled={actionId !== null}
                          onClick={() =>
                            handleUpdateStatus(cand.id, cand.status)
                          }
                          className={`p-1.5 rounded-md border transition cursor-pointer ${cand.status === "BANNED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-orange-50 text-orange-600 border-orange-200"}`}
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
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-md transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}

            {/* 3. TAB TIN TUYỂN DỤNG */}
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
                    className="hover:bg-slate-50/50 transition text-xs font-medium text-slate-700"
                  >
                    <td className="p-4 font-bold text-slate-950">
                      {job.title}
                    </td>
                    <td className="p-4 text-slate-600 font-semibold uppercase">
                      {job.employer?.companyName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">{job.location}</td>
                    <td className="p-4">
                      {job.status === "OPEN" ? (
                        <span className="text-emerald-600 font-bold">
                          MỞ PUBLIC
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">
                          ĐÃ ĐÓNG
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => handleEdit(job.id, "job")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-md transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          disabled={actionId === job.id}
                          onClick={() => handleDelete(job.id, "job")}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition border border-red-100 cursor-pointer"
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

            {/* 4. TAB ĐƠN ỨNG TUYỂN */}
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
                    className="hover:bg-slate-50/50 transition text-xs font-medium text-slate-700"
                  >
                    <td className="p-4 font-bold text-slate-950">
                      {app.candidate?.user?.fullName || "Ẩn danh"}
                    </td>
                    <td className="p-4 text-slate-600 font-bold">
                      {app.job?.title || "N/A"}
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                      {app.matchScore ? `${app.matchScore}%` : "90% (Cố định)"}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px] tracking-wide uppercase">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleDelete(app.id, "application")}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition border border-red-100 cursor-pointer"
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
