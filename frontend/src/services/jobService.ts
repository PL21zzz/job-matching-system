import api from "@/src/lib/axios";

export interface JobFilters {
  search?: string;
  location?: string;
  categoryId?: string | number;
}

export const jobService = {
  // 1. Lấy danh sách Job
  getAllJobs: (params?: JobFilters): Promise<any[]> => {
    return api.get("/jobs", { params });
  },

  // 2. Xem chi tiết Job
  getJobById: (id: string): Promise<any> => {
    return api.get(`/jobs/${id}`);
  },

  // 3. Đăng tuyển Job mới
  createJob: async (payload: any): Promise<any> => {
    const response = await api.post("/jobs", payload);
    return response.data?.data || response.data || response;
  },

  // 4. Danh sách danh mục việc làm
  getCategories: async (): Promise<any[]> => {
    return api.get("/jobs/categories");
  },

  // 5. Danh sách loại khuyết tật
  getDisabilityTypes: async (): Promise<any[]> => {
    const response = await api.get("/jobs/disability-types");
    return response.data?.data || response.data || response;
  },
};
