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
  createJob: (jobData: any): Promise<any> => {
    return api.post("/jobs", jobData);
  },

  getCategories: async (): Promise<any[]> => {
    return api.get("/jobs/categories");
  },
};
