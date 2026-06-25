import { DISABILITY_SUPPORT_GROUPS } from "./disability-support";

type CategoryAccessibilityPreset = {
  matchNames: string[];
  helperText: string;
  disabilityPresets: Record<number, string[]>;
};

const byId = (id: number) =>
  DISABILITY_SUPPORT_GROUPS.find((group) => group.id === id);

const pick = (id: number, indexes: number[]) => {
  const group = byId(id);
  if (!group) return [];
  return indexes
    .map((index) => group.accommodations[index])
    .filter(Boolean) as string[];
};

export const CATEGORY_ACCESSIBILITY_PRESETS: CategoryAccessibilityPreset[] = [
  {
    matchNames: ["Vệ sinh", "Tạp vụ", "Lao động vệ sinh", "Dịch vụ vệ sinh"],
    helperText:
      "Nhóm việc vệ sinh/tạp vụ nên ưu tiên trợ năng gắn với di chuyển thực tế, hướng dẫn rõ ràng theo checklist và giao tiếp đơn giản tại nơi làm việc.",
    disabilityPresets: {
      1: pick(1, [0, 1, 4]),
      2: pick(2, [1, 3, 4]),
      3: pick(3, [0, 2, 4]),
      4: pick(4, [0, 2, 4]),
    },
  },
  {
    matchNames: ["Kho vận", "Đóng gói", "Sắp xếp hàng hóa", "Lao động phổ thông"],
    helperText:
      "Nhóm việc kho vận/đóng gói cần nhấn vào lối đi an toàn, phân công rõ ràng, giao tiếp trực quan và cách phối hợp không phụ thuộc lời nói.",
    disabilityPresets: {
      1: pick(1, [0, 1, 2]),
      2: pick(2, [1, 3, 4]),
      3: pick(3, [0, 2, 4]),
      4: pick(4, [0, 2, 3]),
    },
  },
  {
    matchNames: ["Dịch vụ khách hàng", "Chăm sóc khách hàng", "Lễ tân"],
    helperText:
      "Nhóm việc dịch vụ khách hàng nên chọn trợ năng phù hợp với giao tiếp linh hoạt, ghi chú bằng chữ và quy trình xử lý tình huống rõ ràng.",
    disabilityPresets: {
      1: pick(1, [1, 3]),
      2: pick(2, [0, 1, 3]),
      3: pick(3, [0, 1, 3, 4]),
      4: pick(4, [0, 1, 3, 4]),
    },
  },
  {
    matchNames: ["Nhập liệu", "Hành chính", "Văn phòng", "Kế toán"],
    helperText:
      "Nhóm việc văn phòng/nhập liệu phù hợp với trợ năng số hóa, screen reader, giao tiếp bằng văn bản và mô hình làm việc linh hoạt.",
    disabilityPresets: {
      1: pick(1, [2, 3]),
      2: pick(2, [0, 1, 3, 4]),
      3: pick(3, [0, 1, 4]),
      4: pick(4, [0, 2, 3, 4]),
    },
  },
  {
    matchNames: ["Bán hàng", "Siêu thị", "Thu ngân"],
    helperText:
      "Nhóm việc bán hàng nên làm rõ yêu cầu giao tiếp, vị trí quầy/kệ dễ tiếp cận và các phương thức hỗ trợ bằng chữ hoặc công cụ trực quan.",
    disabilityPresets: {
      1: pick(1, [0, 1, 2]),
      2: pick(2, [1, 3, 4]),
      3: pick(3, [0, 2, 3]),
      4: pick(4, [0, 1, 2, 3]),
    },
  },
  {
    matchNames: ["Bảo vệ", "Trông giữ", "Giám sát"],
    helperText:
      "Nhóm việc bảo vệ/trông giữ cần tập trung vào vị trí làm việc dễ tiếp cận, tín hiệu trực quan và cách phối hợp ca trực bằng quy trình rõ ràng.",
    disabilityPresets: {
      1: pick(1, [0, 1, 4]),
      2: pick(2, [1, 3, 4]),
      3: pick(3, [0, 2, 4]),
      4: pick(4, [0, 2, 4]),
    },
  },
];

export function getCategoryAccessibilityPreset(categoryName?: string | null) {
  if (!categoryName) return null;
  const normalized = categoryName.trim().toLowerCase();

  return (
    CATEGORY_ACCESSIBILITY_PRESETS.find((preset) =>
      preset.matchNames.some((name) => normalized.includes(name.toLowerCase())),
    ) || null
  );
}
