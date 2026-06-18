import api from "@/src/lib/axios";

export const adminService = {
  // 1. Bốc số liệu cho 4 ô màu thống kê đầu trang
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get("/admin/stats");
    return response.data?.data || response.data || response;
  },

  // 2. Lấy danh sách doanh nghiệp đang chờ duyệt (PENDING)
  getPendingEmployers: async (): Promise<any[]> => {
    const response = await api.get("/admin/employers/pending");
    return response.data?.data || response.data || response;
  },

  // 3. Phê duyệt (ACTIVE) hoặc Khóa (BANNED) tài khoản doanh nghiệp
  updateUserStatus: async (
    userId: string,
    status: "ACTIVE" | "BANNED" | "PENDING",
  ): Promise<any> => {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data?.data || response.data || response;
  },
};
