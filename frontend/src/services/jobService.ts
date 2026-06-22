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

  generateCoverLetterAi: async (
    jobId: string,
  ): Promise<{ coverLetter: string }> => {
    const response = await api.get(`/jobs/generate-cover/${jobId}`, {
      timeout: 30000,
    });
    return response.data?.data || response.data || response;
  },

  // 7. Bắn payload lưu đơn ứng tuyển chính thức vào Docker Postgres
  applyJob: async (formData: FormData): Promise<any> => {
    const response = await api.post("/jobs/apply", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ép trình duyệt mở cổng stream file vật lý
      },
    });
    return response;
  },

  getEmployerApplications: async (): Promise<any[]> => {
    const response = await api.get("/jobs/employer/applications");
    return response.data?.data || response.data || response;
  },
};
