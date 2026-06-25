import { DISABILITY_FOCUS_OPTIONS, DISABILITY_SUPPORT_GROUPS } from "./disability-support";
import { Job, JobStatus, JobType } from "../types/job";

export const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    title: "Lập trình viên ReactJS (Junior)",
    description:
      "Phát triển các tính năng giao diện cho nền tảng AI. Hỗ trợ làm việc linh hoạt.",
    requirements:
      "Có kiến thức về ReactJS, hiểu về Web Accessibility là một điểm cộng.",
    salaryMin: 15000000,
    salaryMax: 25000000,
    salaryText: "15 - 25 Triệu",
    location: "Hòa Xuân, Đà Nẵng",
    type: JobType.FULL_TIME,
    status: JobStatus.OPEN,
    accessibilityFeatures:
      "Lối đi xe lăn, Trình đọc màn hình, Hỗ trợ trợ thính",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    employer: {
      id: "emp1",
      companyName: "Novaha Lab",
      logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NL",
    },
    category: { id: 1, name: "Công nghệ thông tin" },
  },
  {
    id: "j2",
    title: "Nhân viên Chăm sóc khách hàng",
    description:
      "Tư vấn và giải đáp thắc mắc của người dùng qua hệ thống ticket và chat.",
    requirements:
      "Kỹ năng giao tiếp tốt, ưu tiên ứng viên có thể làm việc tại nhà.",
    salaryMin: 8000000,
    salaryMax: 12000000,
    salaryText: "8 - 12 Triệu",
    location: "Quận Hải Châu, Đà Nẵng",
    type: JobType.REMOTE,
    status: JobStatus.OPEN,
    accessibilityFeatures: "Làm việc từ xa, Thời gian linh hoạt",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    employer: {
      id: "emp2",
      companyName: "Equitas Tech",
      logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ET",
    },
    category: { id: 2, name: "Dịch vụ khách hàng" },
  },
  {
    id: "j3",
    title: "Thiết kế đồ họa 2D",
    description: "Thiết kế ấn phẩm truyền thông cho các chiến dịch xã hội.",
    requirements:
      "Sử dụng thành thạo Photoshop, Illustrator. Ưu tiên ứng viên khiếm thính.",
    salaryMin: 10000000,
    salaryMax: 15000000,
    salaryText: "10 - 15 Triệu",
    location: "Hồ Chí Minh",
    type: JobType.PART_TIME,
    status: JobStatus.OPEN,
    accessibilityFeatures: "Giao tiếp qua văn bản, Có phụ đề cho video hoặc nội dung đào tạo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    employer: {
      id: "emp3",
      companyName: "FPT Software",
      logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FPT",
    },
    category: { id: 3, name: "Thiết kế" },
  },
];

export const ACCESSIBILITY_OPTIONS = Array.from(
  new Set(DISABILITY_SUPPORT_GROUPS.flatMap((group) => group.accommodations)),
);

export { DISABILITY_FOCUS_OPTIONS };
