import { getInitials } from "@/src/lib/avatar";

interface AvatarBadgeProps {
  className?: string;
  label?: string | null;
  type?: "user" | "company";
}

export default function AvatarBadge({
  className = "",
  label,
  type = "user",
}: AvatarBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 font-black uppercase text-primary ${className}`}
    >
      {getInitials(label, type)}
    </div>
  );
}
