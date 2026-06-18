"use client";

import { adminService } from "@/src/services/adminService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Ban, CheckCircle, Loader2, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalCandidates: 0,
    pendingEmployers: 0,
    openJobs: 0,
    rejectedApplications: 0,
  });
  const [pendingEmployers, setPendingEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      toast.error(
        "Quyền truy cập bị từ chối! Vui lòng đăng nhập tài khoản Admin.",
      );
      router.push("/login");
    }
  }, [user, router]);

  // Đồng bộ toàn bộ dữ liệu từ Backend Docker Postgres
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, employersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingEmployers(),
      ]);
      if (statsRes) setStats(statsRes);
      if (employersRes) setPendingEmployers(employersRes);
    } catch (error) {
      console.error("Lỗi tải dữ liệu Admin:", error);
      toast.error("Không thể kết nối cổng dữ liệu Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Xử lý hành động bấm nút Phê duyệt hoặc Từ chối doanh nghiệp
  const handleProcessEmployer = async (
    userId: string,
    nextStatus: "ACTIVE" | "BANNED",
  ) => {
    try {
      setActionId(userId);
      await adminService.updateUserStatus(userId, nextStatus);
      toast.success(
        nextStatus === "ACTIVE"
          ? "Kích hoạt đối tác thành công!"
          : "Đã từ chối doanh nghiệp.",
      );
      loadAdminData(); // Tải lại bảng dữ liệu mới tinh
    } catch (error) {
      toast.error("Xử lý thất bại, vui lòng thử lại.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-2 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Đang nạp hệ thống quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] font-sans text-slate-800">
      {/* HEADER TOPBAR (GIỐNG ẢNH MẪU) */}
      <nav className="w-full bg-[#343a40] text-white px-6 py-3 flex items-center justify-between shadow-xs select-none">
        <span className="font-bold text-lg tracking-tight uppercase text-slate-200">
          Equitas Central Admin
        </span>
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-md px-3 py-1.5 border border-slate-600 w-64">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="bg-transparent text-xs outline-hidden text-white w-full"
          />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-normal text-slate-900 tracking-tight">
            Dashboard Portal
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Tổng hợp báo cáo trạng thái vĩ mô hệ thống.
          </p>
        </div>

        {/* HÀNG 4 THẺ MÀU ĐẦU TRANG (MAPPING 100% THEO ẢNH MẪU CỦA SẾP) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
          {/* CARD XANH DƯƠNG - PRIMARY */}
          <div className="bg-[#007bff] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tổng ứng viên
              </span>
              <span className="text-2xl font-black">
                {stats.totalCandidates}
              </span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between hover:bg-black/20 cursor-pointer">
              <span>Xem chi tiết</span> ➔
            </div>
          </div>

          {/* CARD VÀNG - WARNING */}
          <div className="bg-[#ffc107] text-slate-900 rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Doanh nghiệp chờ duyệt
              </span>
              <span className="text-2xl font-black">
                {stats.pendingEmployers}
              </span>
            </div>
            <div className="bg-black/5 px-4 py-2 text-[11px] font-medium flex items-center justify-between hover:bg-black/10 cursor-pointer">
              <span>Kiểm duyệt ngay</span> ➔
            </div>
          </div>

          {/* CARD XANH LÁ - SUCCESS */}
          <div className="bg-[#28a745] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Tin tuyển dụng đang mở
              </span>
              <span className="text-2xl font-black">{stats.openJobs}</span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between hover:bg-black/20 cursor-pointer">
              <span>Quản lý bài đăng</span> ➔
            </div>
          </div>

          {/* CARD ĐỎ - DANGER */}
          <div className="bg-[#dc3545] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between h-28">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Đơn bị từ chối
              </span>
              <span className="text-2xl font-black">
                {stats.rejectedApplications}
              </span>
            </div>
            <div className="bg-black/10 px-4 py-2 text-[11px] font-medium flex items-center justify-between hover:bg-black/20 cursor-pointer">
              <span>Theo dõi luồng đơn</span> ➔
            </div>
          </div>
        </div>

        {/* KHỐI BẢNG DỮ LIỆU DATATABLE PHÊ DUYỆT DOANH NGHIỆP MỚI */}
        <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider select-none">
            <Users size={16} /> Danh sách doanh nghiệp đang chờ duyệt tài khoản
          </div>

          <div className="overflow-x-auto">
            {pendingEmployers.length === 0 ? (
              <div className="p-10 text-center text-xs font-bold text-slate-400 select-none">
                Hiện tại không có doanh nghiệp nào đang xếp hàng chờ kích hoạt.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 select-none">
                    <th className="p-4">Tên doanh nghiệp</th>
                    <th className="p-4">Mã số thuế</th>
                    <th className="p-4">Địa chỉ văn phòng</th>
                    <th className="p-4">Hạ tầng trợ năng khai báo</th>
                    <th className="p-4 text-right">Hành động xử lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  {pendingEmployers.map((emp) => (
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
                      <td className="p-4">
                        <span className="bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {emp.employerProfile?.accessibilityFeatures ||
                            "Trợ năng cơ bản"}
                        </span>
                      </td>
                      <td className="p-4 text-right select-none">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            disabled={actionId !== null}
                            onClick={() =>
                              handleProcessEmployer(emp.id, "BANNED")
                            }
                            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-bold transition duration-150 border border-red-200/50 cursor-pointer"
                          >
                            <Ban size={12} /> Từ chối
                          </button>
                          <button
                            type="button"
                            disabled={actionId !== null}
                            onClick={() =>
                              handleProcessEmployer(emp.id, "ACTIVE")
                            }
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-bold transition duration-150 shadow-xs cursor-pointer"
                          >
                            {actionId === emp.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <>
                                <CheckCircle size={12} /> Phê duyệt
                              </>
                            )}
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
