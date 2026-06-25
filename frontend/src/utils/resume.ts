export const getDisabilityTag = (type: string | undefined) => {
  if (!type) return null;

  const formattedType = type.toLowerCase();

  if (
    formattedType.includes("vận động") ||
    formattedType.includes("khuyết tật vận động") ||
    formattedType.includes("xe lăn") ||
    formattedType.includes("mobility")
  ) {
    return { label: "Khuyết tật vận động", icon: "♿" };
  }

  if (
    formattedType.includes("khiếm thị") ||
    formattedType.includes("mù") ||
    formattedType.includes("thị giác") ||
    formattedType.includes("blind")
  ) {
    return { label: "Khiếm thị", icon: "👁️" };
  }

  if (
    formattedType.includes("khiếm thính") ||
    formattedType.includes("điếc") ||
    formattedType.includes("thính giác") ||
    formattedType.includes("hearing")
  ) {
    return { label: "Khiếm thính", icon: "🦻" };
  }

  if (
    formattedType.includes("câm") ||
    formattedType.includes("khó nói") ||
    formattedType.includes("speech") ||
    formattedType.includes("ngôn ngữ")
  ) {
    return { label: "Câm / khó nói", icon: "💬" };
  }

  return { label: type, icon: "✨" };
};
