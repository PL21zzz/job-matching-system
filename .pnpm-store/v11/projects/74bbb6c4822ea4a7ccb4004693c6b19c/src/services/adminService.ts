import api from "@/src/lib/axios";

export const adminService = {
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get("/admin/stats");
    return response;
  },

  getAllCandidates: async () => {
    const response = await api.get("/admin/candidates");
    return response;
  },

  getAllEmployers: async () => {
    const response = await api.get("/admin/employers");
    return response;
  },

  getAllJobs: async () => {
    const response = await api.get("/admin/jobs");
    return response;
  },

  getAllApplications: async () => {
    const response = await api.get("/admin/applications");
    return response;
  },

  getAllCategories: async () => {
    const response = await api.get("/admin/categories");
    return response;
  },

  createCategory: async (name: string) => {
    const response = await api.post("/admin/categories", { name });
    return response;
  },

  updateCategory: async (categoryId: number, name: string) => {
    const response = await api.patch(`/admin/categories/${categoryId}`, { name });
    return response;
  },

  deleteCategory: async (categoryId: number) => {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response;
  },

  updateUserStatus: async (
    userId: string,
    status: "ACTIVE" | "BANNED" | "PENDING",
  ) => {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  },

  deleteJob: async (jobId: string) => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response;
  },

  deleteApplication: async (applicationId: string) => {
    const response = await api.delete(`/admin/applications/${applicationId}`);
    return response;
  },
};
