import { DISABILITY_SUPPORT_GROUPS } from "./disability-support";

export const EMPLOYER_ACCESSIBILITY_OPTIONS = Array.from(
  new Set(DISABILITY_SUPPORT_GROUPS.flatMap((group) => group.accommodations)),
);

export const FEATURED_EMPLOYER_ACCESSIBILITY_OPTIONS = [
  "Có lối đi và cửa ra vào phù hợp xe lăn",
  "Có thang máy hoặc khu làm việc ở tầng thuận tiện",
  "Hệ thống tương thích trình đọc màn hình",
  "Giao tiếp công việc qua chat hoặc văn bản",
  "Cho phép làm việc từ xa hoặc hybrid",
  "Không bắt buộc gọi điện hoặc thuyết trình bằng lời nói",
];

export const MORE_EMPLOYER_ACCESSIBILITY_OPTIONS =
  EMPLOYER_ACCESSIBILITY_OPTIONS.filter(
    (item) => !FEATURED_EMPLOYER_ACCESSIBILITY_OPTIONS.includes(item),
  );
