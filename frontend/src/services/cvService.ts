import api from "@/src/lib/axios";

export const cvService = {
  // 1. Lấy danh sách các mẫu template CV từ DB
  getTemplates: async (): Promise<any> => {
    const response = await api.get("/resumes/templates");
    return response.data?.data || response.data || response;
  },

  // 2. Gọi AI gọt giũa đoạn văn kinh nghiệm dựa theo JD công việc
  optimizeWithAI: async (payload: {
    rawText: string;
    jobTitle: string;
    requirements: string;
  }): Promise<any> => {
    const response = await api.post("/resumes/ai/optimize", payload);
    return response.data?.data || response.data || response;
  },

  // 3. Lưu bản nháp CV xuống cơ sở dữ liệu
  saveCv: async (payload: any): Promise<any> => {
    const response = await api.post("/resumes/save", payload);
    return response.data?.data || response.data || response;
  },
};
