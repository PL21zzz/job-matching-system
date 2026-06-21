"use client";

import { adminService } from "@/src/services/adminService";
import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const router = useRouter();

  // 1. Quản lý State Dữ liệu
  const [stats, setStats] = useState<any>({
    totalCandidates: 0,
    pendingEmployers: 0,
    openJobs: 0,
    rejectedApplications: 0,
  });
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  // 2. Quản lý State Trạng thái UI
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"employers" | "candidates">(
    "employers",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🚀 BƯỚC 1: ROUTE GUARD TUYỆT ĐỐI BẰNG TOKEN VẬT LÝ (CHỐNG XOAY VÒNG VÀ VĂNG TRANG KHI F5)
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      toast.error("Vui lòng đăng nhập tài khoản Quản trị!");
      router.push("/login");
    } else {
      // Có token vật lý -> Cho phép đứng ở trang này luôn và kích hoạt cào DB Backend
      setIsCheckingAuth(false);
      loadAdminData();
    }
  }, [router]);

  // ⚙️ BƯỚC 2: HÀM CÀO DỮ LIỆU THÔ CHUẨN AXIOS (ĐÃ ĐƯỢC FIX LỖI ĐỌC MẢNG PHẲNG)
  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      console.log("=== BẮT ĐẦU KÍCH HOẠT GỌI API ADMIN ===");

      const [statsRes, employersRes, candidatesRes] = await Promise.all([
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
      ]);

      console.log("Dữ liệu Stats nhận về:", statsRes);
      console.log("Dữ liệu Employers thô nhận về:", employersRes);
      console.log("Dữ liệu Candidates thô nhận về:", candidatesRes);

      if (statsRes) setStats(statsRes);

      setEmployers(Array.isArray(employersRes) ? employersRes : []);
      setCandidates(Array.isArray(candidatesRes) ? candidatesRes : []);
    } catch (error) {
      console.error("Lỗi tổng trong block try-catch:", error);
      toast.error("Không thể kết nối cổng dữ liệu Admin.");
    } finally {
      setLoadingData(false);
      console.log("=== KẾT THÚC TIẾN TRÌNH CALL DATA ===");
    }
  };

  // 🛠️ BƯỚC 3: CÁC HÀM XỬ LÝ SỰ KIỆN NÚT (SỬA / XÓA / PHÊ DUYỆT)
  const handleEdit = (id: string, type: "employer" | "candidate") => {
    toast.success(`Mở Modal chỉnh sửa cho ${type} ID: ${id}`);
    // Sếp có thể mở Modal Form hoặc điều hướng tùy ý ở bước sau
  };

  const handleDelete = async (id: string, type: "employer" | "candidate") => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa ${type === "employer" ? "Doanh nghiệp" : "Ứng viên"} này không?`,
      )
    ) {
      toast.error(
        `Chức năng Xóa ID: ${id} đang đợi sếp cung cấp Controller Backend để đấu nối!`,
      );
    }
  };

  // Bộ lọc dữ liệu tìm kiếm nhanh
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

  // Màn hình loading bảo vệ luồng xác thực ban đầu
  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-slate-600 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] font-sans text-slate-800">
      {/* HEADER TOPBAR */}
      <nav className="w-full bg-[#343a40] text-white px-6 py-3 flex items-center justify-between shadow-xs select-none">
        <span className="font-bold text-lg uppercase text-slate-200">
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
            className="bg-white hover:bg-slate-50 border text-xs font-bold px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            {loadingData ? "Đang tải..." : "Làm mới dữ liệu 🔄"}
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
              <span>Xem ứng viên</span> ➔
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
              <span className="text-2xl font-black">
                {stats.pendingEmployers}
              </span>
            </div>
            <div className="bg-black/5 px-4 py-2 text-[11px] font-medium flex items-center justify-between">
              <span>Xem kiểm duyệt</span> ➔
            </div>
          </div>

          <div className="bg-[#28a745] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 opacity-85">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tin tuyển dụng đang mở
              </span>
              <span className="text-2xl font-black">{stats.openJobs}</span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium">
              Hệ thống đang theo dõi
            </div>
          </div>

          <div className="bg-[#dc3545] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28 opacity-85">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Đơn bị từ chối
              </span>
              <span className="text-2xl font-black">
                {stats.rejectedApplications}
              </span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium">
              Hệ thống đang theo dõi
            </div>
          </div>
        </div>

        {/* BẢNG CHUYỂN TAB QUẢN LÝ THÀNH VIÊN */}
        <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-4 border-b border-slate-200 flex gap-4">
            <button
              onClick={() => setActiveTab("employers")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 ${activeTab === "employers" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}
            >
              Quản lý doanh nghiệp ({filteredEmployers.length})
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`py-3.5 px-2 text-xs font-bold uppercase border-b-2 ${activeTab === "candidates" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}
            >
              Quản lý Ứng viên ({filteredCandidates.length})
            </button>
          </div>

          <div className="p-2">
            {loadingData ? (
              <div className="p-20 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                <Loader2 className="animate-spin text-blue-600 w-6 h-6" /> ĐANG
                ĐỒNG BỘ DATA...
              </div>
            ) : activeTab === "employers" ? (
              filteredEmployers.length === 0 ? (
                <div className="p-10 text-center text-xs font-bold text-slate-400">
                  Không tìm thấy dữ liệu doanh nghiệp nào.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase border-b">
                      <th className="p-4">Tên doanh nghiệp</th>
                      <th className="p-4">Mã số thuế</th>
                      <th className="p-4">Địa chỉ văn phòng</th>
                      <th className="p-4 text-right">Thao tác quản lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                    {filteredEmployers.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/50 transition"
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
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleEdit(emp.id, "employer")}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-md transition cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id, "employer")}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition border border-red-100 cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : filteredCandidates.length === 0 ? (
              <div className="p-10 text-center text-xs font-bold text-slate-400">
                Không tìm thấy dữ liệu ứng viên nào.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase border-b">
                    <th className="p-4">Tên Ứng viên</th>
                    <th className="p-4">Email hệ thống</th>
                    <th className="p-4">Trạng thái tài khoản</th>
                    <th className="p-4 text-right">Thao tác quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  {filteredCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="p-4 font-bold text-slate-950">
                        {cand.fullName || "Ẩn danh"}
                      </td>
                      <td className="p-4 text-slate-500 font-mono">
                        {cand.email}
                      </td>
                      <td className="p-4">
                        {cand.status === "BANNED" ? (
                          <span className="text-red-600 font-bold uppercase">
                            Bị khóa
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold uppercase">
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEdit(cand.id, "candidate")}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-md transition cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(cand.id, "candidate")}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition border border-red-100 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
