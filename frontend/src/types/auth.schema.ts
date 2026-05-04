import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ và tên quá ngắn"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập lại mật khẩu"),
    role: z.enum(["Candidate", "Employer"], {
      message: "Vui lòng chọn vai trò của bạn",
    }),
    // 1. Cho phép companyName là optional ở mức định nghĩa field
    companyName: z.string().optional(),
  })
  // 2. Kiểm tra mật khẩu khớp nhau (Giữ nguyên của sếp)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  })
  // 3. Logic "Đặc sản": Validate companyName dựa trên Role
  .refine(
    (data) => {
      if (data.role === "Employer") {
        // Nếu là Employer, companyName không được để trống và phải có ít nhất 2 ký tự
        return data.companyName && data.companyName.trim().length >= 2;
      }
      return true; // Nếu là Candidate thì bỏ qua
    },
    {
      message: "Tên doanh nghiệp là bắt buộc đối với nhà tuyển dụng",
      path: ["companyName"], // Báo lỗi đúng ô nhập tên công ty
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;
