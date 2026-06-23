export const SUPPORTED_DISABILITY_TYPES = [
  {
    id: 1,
    name: 'Khuyết tật vận động',
    description:
      'Phù hợp với người gặp khó khăn trong di chuyển, đứng lâu hoặc thao tác cần hỗ trợ vận động.',
    aliases: ['vận động', 'khuyết tật vận động', 'xe lăn', 'mobility'],
  },
  {
    id: 2,
    name: 'Khiếm thị',
    description:
      'Phù hợp với người mù hoặc suy giảm thị lực, cần tương thích trình đọc màn hình và điều hướng rõ ràng.',
    aliases: ['khiếm thị', 'mù', 'thị giác', 'blind', 'screen reader'],
  },
  {
    id: 3,
    name: 'Khiếm thính',
    description:
      'Phù hợp với người khó nghe hoặc điếc, ưu tiên giao tiếp trực quan và văn bản rõ ràng.',
    aliases: ['khiếm thính', 'điếc', 'thính giác', 'hearing'],
  },
  {
    id: 4,
    name: 'Câm',
    description:
      'Phù hợp với người gặp khó khăn trong phát âm hoặc giao tiếp bằng lời nói, ưu tiên trao đổi qua văn bản.',
    aliases: ['câm', 'khó nói', 'ngôn ngữ', 'speech'],
  },
] as const;

export const SUPPORTED_DISABILITY_TYPE_IDS = SUPPORTED_DISABILITY_TYPES.map(
  (item) => item.id,
);

export type StructuredAccessibilityFeature = {
  version: 1;
  tags: string[];
  groups: Array<{
    disabilityTypeId: number;
    disabilityTypeName: string;
    accommodations: string[];
  }>;
};

export function parseAccessibilityFeatures(
  raw?: string | null,
): StructuredAccessibilityFeature | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StructuredAccessibilityFeature;
    if (
      parsed &&
      parsed.version === 1 &&
      Array.isArray(parsed.tags) &&
      Array.isArray(parsed.groups)
    ) {
      return {
        version: 1,
        tags: parsed.tags.filter(Boolean),
        groups: parsed.groups
          .filter(
            (group) =>
              group &&
              typeof group.disabilityTypeId === 'number' &&
              typeof group.disabilityTypeName === 'string' &&
              Array.isArray(group.accommodations),
          )
          .map((group) => ({
            disabilityTypeId: group.disabilityTypeId,
            disabilityTypeName: group.disabilityTypeName,
            accommodations: group.accommodations.filter(Boolean),
          })),
      };
    }
  } catch {
    return {
      version: 1,
      tags: raw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      groups: [],
    };
  }

  return null;
}

export function extractAccessibilityTags(raw?: string | null): string[] {
  const parsed = parseAccessibilityFeatures(raw);
  if (!parsed) {
    return [];
  }

  const nestedTags = parsed.groups.flatMap((group) => group.accommodations);
  return Array.from(new Set([...parsed.tags, ...nestedTags].filter(Boolean)));
}
