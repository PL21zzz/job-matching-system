import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";

export type JobAccessibilityGroupInput = {
  disabilityTypeId: number;
  disabilityTypeName?: string;
  accommodations: string[];
};

type ParsedJobAccessibility = {
  tags: string[];
  groups: Array<{
    disabilityTypeId: number;
    disabilityTypeName: string;
    accommodations: string[];
  }>;
};

export function serializeJobAccessibility(
  groups: JobAccessibilityGroupInput[],
): string | null {
  const normalizedGroups = groups
    .map((group) => {
      const meta = DISABILITY_SUPPORT_GROUPS.find(
        (item) => item.id === group.disabilityTypeId,
      );

      return {
        disabilityTypeId: group.disabilityTypeId,
        disabilityTypeName:
          group.disabilityTypeName || meta?.label || `Nhóm ${group.disabilityTypeId}`,
        accommodations: Array.from(
          new Set(group.accommodations.map((item) => item.trim()).filter(Boolean)),
        ),
      };
    })
    .filter((group) => group.accommodations.length > 0);

  if (!normalizedGroups.length) {
    return null;
  }

  const tags = Array.from(
    new Set(normalizedGroups.flatMap((group) => group.accommodations)),
  );

  return JSON.stringify({
    version: 1,
    tags,
    groups: normalizedGroups,
  });
}

export function parseJobAccessibility(raw?: string | null): ParsedJobAccessibility {
  if (!raw) {
    return { tags: [], groups: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.version === 1 &&
      Array.isArray(parsed.tags) &&
      Array.isArray(parsed.groups)
    ) {
      return {
        tags: parsed.tags.filter(Boolean),
        groups: parsed.groups.map((group: any) => ({
          disabilityTypeId: Number(group.disabilityTypeId),
          disabilityTypeName: group.disabilityTypeName || "Chưa rõ",
          accommodations: Array.isArray(group.accommodations)
            ? group.accommodations.filter(Boolean)
            : [],
        })),
      };
    }
  } catch {
    return {
      tags: raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      groups: [],
    };
  }

  return { tags: [], groups: [] };
}

export function getAccessibilityTags(raw?: string | null) {
  return parseJobAccessibility(raw).tags;
}
