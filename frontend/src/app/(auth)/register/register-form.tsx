import { ArrowLeft, Building2, Lock, Mail, User } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RegisterInput } from "../../../types/auth.schema";

interface RegisterFormProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
  isSubmitting: boolean;
  onBack: () => void;
  selectedRole: string;
}

export const RegisterForm = ({
  register,
  errors,
  isSubmitting,
  onBack,
  selectedRole,
}: RegisterFormProps) => (
  <div className="animate-in fade-in slide-in-from-right duration-500 flex flex-col justify-center h-full">
    {/* Nút quay lại - Giảm mb từ 6 xuống 4 */}
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-2 text-primary font-semibold text-sm mb-4 hover:translate-x-1 transition-transform w-fit"
    >
      <ArrowLeft size={16} /> Quay lại
    </button>

    {/* Tiêu đề - Giảm mb từ 2 xuống 1 */}
    <h2 className="text-3xl font-extrabold text-gray-950 mb-1 tracking-tighter leading-tight">
      Thông tin {selectedRole === "Employer" ? "Doanh nghiệp" : "Cá nhân"}
    </h2>

    {/* Subtitle - Giảm mb từ 8 xuống 4 để tiết kiệm diện tích */}
    <p className="text-gray-500 mb-5 text-sm">
      Đăng ký với tư cách: <b className="text-primary">{selectedRole}</b>
    </p>

    {/* Space-y-3 thay vì 4 để các ô khít nhau hơn một chút */}
    <div className="space-y-3">
      {/* Ô nhập Tên công ty */}
      {selectedRole === "Employer" && (
        <div className="relative animate-in zoom-in duration-300">
          <Building2
            className="absolute left-4 top-3.5 text-gray-400"
            size={20}
          />
          <input
            {...register("companyName")}
            className="w-full pl-12 py-3.5 px-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm"
            placeholder="Tên công ty / Doanh nghiệp"
          />
          {errors.companyName && (
            <p className="text-red-500 text-[10px] mt-0.5 ml-2">
              {errors.companyName.message}
            </p>
          )}
        </div>
      )}

      {/* Ô nhập Họ và tên */}
      <div className="relative">
        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          {...register("fullName")}
          className="w-full pl-12 py-3.5 px-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm"
          placeholder={
            selectedRole === "Employer" ? "Tên người đại diện" : "Họ và tên"
          }
        />
        {errors.fullName && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-2">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          {...register("email")}
          className="w-full pl-12 py-3.5 px-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-2">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          {...register("password")}
          type="password"
          className="w-full pl-12 py-3.5 px-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm"
          placeholder="Mật khẩu"
        />
        {errors.password && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-2">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          {...register("confirmPassword")}
          type="password"
          className="w-full pl-12 py-3.5 px-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-sm"
          placeholder="Nhập lại mật khẩu"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-2 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Nút Đăng ký - mt-4 để tạo khoảng cách vừa phải */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-[#25b5ba] active:scale-[0.98] transition-all disabled:bg-gray-400 text-base"
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </div>
    </div>
  </div>
);
