import { LucideIcon } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps {
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export const AuthInput = ({
  icon: Icon,
  placeholder,
  type = "text",
  error,
  register,
}: AuthInputProps) => (
  <div className="relative w-full">
    <Icon
      className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
      size={20}
    />
    <input
      {...register}
      type={type}
      className={`w-full rounded-xl border bg-white px-4 py-3.5 pl-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-[#0f1623] dark:text-white dark:placeholder:text-slate-500
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-200 focus:border-primary dark:focus:border-primary"
        }`}
      placeholder={placeholder}
    />
    {error && (
      <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{error}</p>
    )}
  </div>
);
