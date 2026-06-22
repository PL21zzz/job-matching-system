import api from "@/src/lib/axios";

export const adminService = {
  // 1. Bốc số liệu cho 4 ô màu thống kê đầu trang
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get("/admin/stats");
    // 🌟 ĐỒNG BỘ: Trả về thẳng response vì Interceptor của sếp đã bóc sẵn vỏ .data rồi!
    return response;
  },

  // 2. Hàm lấy danh sách tất cả ứng viên
  getAllCandidates: async () => {
    const response = await api.get("/admin/candidates");
    return response;
  },

  // 3. Lấy danh sách tất cả nhà tuyển dụng
  getAllEmployers: async () => {
    const response = await api.get("/admin/employers");
    return response;
  },

  // 💼 4. LẤY DANH SÁCH TẤT CẢ TIN TUYỂN DỤNG
  getAllJobs: async () => {
    const response = await api.get("/admin/jobs");
    return response;
  },

  // 📄 5. LẤY DANH SÁCH TẤT CẢ ĐƠN ỨNG TUYỂN
  getAllApplications: async () => {
    const response = await api.get("/admin/applications");
    return response;
  },

  // 🚀 6. CẬP NHẬT TRẠNG THÁI USER (Phê duyệt ACTIVE / Khóa BANNED)
  updateUserStatus: async (
    userId: string,
    status: "ACTIVE" | "BANNED" | "PENDING",
  ) => {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response;
  },

  // 🗑️ 7. XÓA TIN TUYỂN DỤNG RÁC KHỎI HỆ THỐNG
  deleteJob: async (jobId: string) => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response;
  },

  // 🗑️ 8. XÓA ĐƠN ỨNG TUYỂN RÁC KHỎI HỆ THỐNG
  deleteApplication: async (applicationId: string) => {
    const response = await api.delete(`/admin/applications/${applicationId}`);
    return response;
  },
};
