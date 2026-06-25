const COMPANY_STOP_WORDS = new Set([
  "cong",
  "ty",
  "tnhh",
  "cp",
  "co",
  "phan",
  "trach",
  "nhiem",
  "huu",
  "han",
  "company",
  "limited",
  "ltd",
]);

function normalizeVietnamese(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function getInitials(
  value?: string | null,
  type: "user" | "company" = "user",
) {
  if (!value) {
    return type === "company" ? "CT" : "U";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return type === "company" ? "CT" : "U";
  }

  const normalizedWords = normalizeVietnamese(trimmed)
    .split(/\s+/)
    .filter(Boolean);

  const originalWords = trimmed.split(/\s+/).filter(Boolean);

  let words =
    type === "company"
      ? originalWords.filter((word, index) => {
          const normalized = normalizedWords[index]?.toLowerCase() || "";
          return !COMPANY_STOP_WORDS.has(normalized);
        })
      : originalWords;

  if (!words.length) {
    words = originalWords;
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const first = words[0]?.charAt(0) || "";
  const last = words[words.length - 1]?.charAt(0) || "";

  return `${first}${last}`.toUpperCase();
}
