export type DisabilitySupportGroup = {
  id: number;
  label: string;
  description: string;
  keywords: string[];
  accommodations: string[];
};

export const DISABILITY_SUPPORT_GROUPS: DisabilitySupportGroup[] = [
  {
    id: 1,
    label: "Khuyết tật vận động",
    description:
      "Ưu tiên môi trường làm việc dễ tiếp cận, di chuyển thuận tiện và linh hoạt tư thế làm việc.",
    keywords: ["khuyết tật vận động", "vận động", "xe lăn", "mobility"],
    accommodations: [
      "Có lối đi và cửa ra vào phù hợp xe lăn",
      "Có thang máy hoặc khu làm việc ở tầng thuận tiện",
      "Bàn làm việc linh hoạt độ cao hoặc dễ tiếp cận",
      "Cho phép làm việc từ xa hoặc hybrid",
      "Nhà vệ sinh tiếp cận được",
    ],
  },
  {
    id: 2,
    label: "Khiếm thị",
    description:
      "Ưu tiên công việc có công cụ số tương thích screen reader và quy trình giao tiếp rõ ràng.",
    keywords: ["khiếm thị", "mù", "thị giác", "blind", "screen reader"],
    accommodations: [
      "Hệ thống tương thích trình đọc màn hình",
      "Tài liệu số hóa, có thể đọc bằng công cụ hỗ trợ",
      "Có mô tả âm thanh hoặc hướng dẫn bằng giọng nói khi cần",
      "Giao diện web nội bộ có cấu trúc rõ ràng, dễ điều hướng",
      "Cho phép dùng thiết bị hỗ trợ cá nhân",
    ],
  },
  {
    id: 3,
    label: "Khiếm thính",
    description:
      "Ưu tiên giao tiếp bằng chữ, thông báo trực quan và quy trình phối hợp không phụ thuộc âm thanh.",
    keywords: ["khiếm thính", "điếc", "thính giác", "hearing"],
    accommodations: [
      "Giao tiếp công việc qua chat hoặc văn bản",
      "Có phụ đề cho video hoặc nội dung đào tạo",
      "Thông báo trực quan thay cho chuông hoặc âm báo",
      "Họp có hỗ trợ ghi chú hoặc tóm tắt bằng chữ",
      "Ưu tiên quy trình làm việc rõ ràng bằng văn bản",
    ],
  },
  {
    id: 4,
    label: "Câm",
    description:
      "Ưu tiên môi trường làm việc chấp nhận trao đổi qua chữ và không bắt buộc giao tiếp bằng lời nói.",
    keywords: ["câm", "khó nói", "ngôn ngữ", "speech", "giao tiếp văn bản"],
    accommodations: [
      "Có thể trao đổi công việc hoàn toàn qua văn bản",
      "Không bắt buộc gọi điện hoặc thuyết trình bằng lời nói",
      "Có biểu mẫu/chat nội bộ thay cho trao đổi miệng",
      "Cho phép phản hồi qua email, chat hoặc tài liệu",
      "Đánh giá hiệu quả dựa trên đầu ra thay vì giao tiếp lời nói",
    ],
  },
];

export const DISABILITY_FOCUS_OPTIONS = DISABILITY_SUPPORT_GROUPS.map(
  (group) => ({
    label:
      group.id === 1
        ? "Vận động"
        : group.id === 2
          ? "Khiếm thị"
          : group.id === 3
            ? "Khiếm thính"
            : "Câm",
    keywords: [...group.keywords, ...group.accommodations],
  }),
);
