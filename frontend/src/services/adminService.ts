import api from "@/src/lib/axios";

export const adminService = {
  // 1. Bốc số liệu cho 4 ô màu thống kê đầu trang
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get("/admin/stats");
    return response.data?.data || response.data || response;
  },

  // 🚀 Hàm lấy danh sách tất cả ứng viên
  getAllCandidates: async () => {
    const response = await api.get("/admin/candidates");
    return response; // 🌟 TRẢ VỀ THẲNG BIẾN 'response' (Nó chính là mảng thô, bỏ chữ .data đi sếp)
  },

  // 🚀 Lấy danh sách tất cả nhà tuyển dụng
  getAllEmployers: async () => {
    const response = await api.get("/admin/employers");
    return response; // 🌟 TRẢ VỀ THẲNG BIẾN 'response' (Bỏ chữ .data đi sếp)
  },
};
