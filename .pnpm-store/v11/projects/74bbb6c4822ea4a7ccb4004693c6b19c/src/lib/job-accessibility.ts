import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";

export type JobAccessibilityGroupInput = {
  disabilityTypeId: number;
  disabilityTypeName?: string;
  accommodations: string[];
};

export type JobOfficeFacilityInput = {
  officeFacilities?: string[];
};

type ParsedJobAccessibility = {
  tags: string[];
  officeFacilities: string[];
  groups: Array<{
    disabilityTypeId: number;
    disabilityTypeName: string;
    accommodations: string[];
  }>;
};

export function serializeJobAccessibility(
  groups: JobAccessibilityGroupInput[],
  options?: JobOfficeFacilityInput,
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

  const officeFacilities = Array.from(
    new Set((options?.officeFacilities || []).map((item) => item.trim()).filter(Boolean)),
  );

  if (!normalizedGroups.length && !officeFacilities.length) {
    return null;
  }

  const tags = Array.from(
    new Set([
      ...normalizedGroups.flatMap((group) => group.accommodations),
      ...officeFacilities,
    ]),
  );

  return JSON.stringify({
    version: 1,
    tags,
    officeFacilities,
    groups: normalizedGroups,
  });
}

export function parseJobAccessibility(raw?: string | null): ParsedJobAccessibility {
  if (!raw) {
    return { tags: [], officeFacilities: [], groups: [] };
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
        officeFacilities: Array.isArray(parsed.officeFacilities)
          ? parsed.officeFacilities.filter(Boolean)
          : [],
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
    const legacyItems = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      tags: legacyItems,
      officeFacilities: legacyItems,
      groups: [],
    };
  }

  return { tags: [], officeFacilities: [], groups: [] };
}

export function getAccessibilityTags(raw?: string | null) {
  return parseJobAccessibility(raw).tags;
}
