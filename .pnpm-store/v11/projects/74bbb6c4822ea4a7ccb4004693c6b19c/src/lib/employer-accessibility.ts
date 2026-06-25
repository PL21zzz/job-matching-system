export function parseSelectedAccessibilityOptions(
  raw?: string | null,
): string[] {
  if (!raw) {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(/\r?\n|,|;/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function serializeSelectedAccessibilityOptions(
  items: string[],
): string {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).join(
    ", ",
  );
}
