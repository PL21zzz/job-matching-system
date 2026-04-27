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
    <Icon className="absolute left-4 top-3.5 text-gray-400" size={20} />
    <input
      {...register}
      type={type}
      className={`w-full pl-12 py-3.5 px-4 rounded-xl border outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm
        ${error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
      placeholder={placeholder}
    />
    {error && (
      <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{error}</p>
    )}
  </div>
);
