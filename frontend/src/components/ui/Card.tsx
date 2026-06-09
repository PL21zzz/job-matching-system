import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  layoutClassName?: string;
  shadow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  layoutClassName = "p-6 sm:p-8",
  shadow = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle transition-colors duration-300 ${
        shadow ? "shadow-xl" : "shadow-sm"
      } ${layoutClassName} ${className}`}
    >
      {children}
    </div>
  );
}
