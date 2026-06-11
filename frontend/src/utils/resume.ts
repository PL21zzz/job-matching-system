export const getDisabilityTag = (type: string | undefined) => {
  if (!type) return null;

  const formattedType = type.toLowerCase();

  if (formattedType.includes("vận động") || formattedType.includes("chi")) {
    return { label: "Assistive Wheelchair", icon: "♿" };
  }
  if (formattedType.includes("thị") || formattedType.includes("nhìn")) {
    return { label: "Screen Reader Ready", icon: "👁️" };
  }
  if (formattedType.includes("thính") || formattedType.includes("nói")) {
    return { label: "Sign Language / Subtitles", icon: "🧏" };
  }

  // Trường hợp mặc định nếu có loại khác
  return { label: type, icon: "✨" };
};
