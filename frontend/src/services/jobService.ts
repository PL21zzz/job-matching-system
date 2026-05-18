import { MOCK_JOBS } from "@/src/constants/jobs";
import api from "@/src/lib/axios"; // Instance axios sếp đã cấu hình có interceptor
import { Job, JobType } from "@/src/types/job";

// Interface cho bộ lọc (Filter) trang danh sách
export interface JobFilterParams {
  search?: string;
  type?: JobType | "";
  minSalary?: number;
  maxSalary?: number;
  accessibility?: string[]; // Lọc theo mảng các tiện ích hỗ trợ
}

export const jobService = {
  /**
   * Lấy danh sách việc làm (Có hỗ trợ lọc)
   * Hiện tại: Dùng Mock Data và tự xử lý lọc ở Frontend
   * Tương lai: Sếp chỉ cần thay bằng: return api.get("/jobs", { params });
   */
  async getAllJobs(params: JobFilterParams): Promise<Job[]> {
    // Giả lập độ trễ của mạng (500ms) để sếp test Skeleton Loading sau này
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredJobs = [...MOCK_JOBS];

    // Logic lọc theo từ khóa (Tiêu đề hoặc tên công ty)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.employer.companyName.toLowerCase().includes(searchLower),
      );
    }

    // Lọc theo hình thức (Full-time, Remote...)
    if (params.type) {
      filteredJobs = filteredJobs.filter((job) => job.type === params.type);
    }

    // Lọc theo tiện ích hỗ trợ (Accessibility Features)
    // Kiểm tra xem mảng features của job có chứa TẤT CẢ các features người dùng chọn không
    if (params.accessibility && params.accessibility.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        if (!job.accessibilityFeatures) return false;
        const jobFeatures = job.accessibilityFeatures.split(", ");
        return params.accessibility?.every((f) => jobFeatures.includes(f));
      });
    }

    // Lọc theo lương
    if (params.minSalary) {
      filteredJobs = filteredJobs.filter(
        (job) => (job.salaryMin ?? 0) >= params.minSalary!,
      );
    }

    return filteredJobs;
  },

  /**
   * Lấy chi tiết một công việc theo ID
   */
  async getJobById(id: string): Promise<Job | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Hiện tại: Tìm trong Mock
    // Tương lai: return api.get(`/jobs/${id}`);
    return MOCK_JOBS.find((job) => job.id === id);
  },

  /**
   * Hàm mẫu để ứng tuyển (Sau này sếp dùng ở Module 3)
   */
  async applyJob(jobId: string, cvFile: File) {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("cv", cvFile);

    return api.post("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
