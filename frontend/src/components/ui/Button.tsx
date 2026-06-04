import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "w-full py-4 px-4 rounded-xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 select-none cursor-pointer hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg shadow-primary/20",
    secondary:
      "bg-slate-200 dark:bg-secondary hover:bg-slate-300 text-slate-900 dark:text-white border border-slate-300 dark:border-border-subtle",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
