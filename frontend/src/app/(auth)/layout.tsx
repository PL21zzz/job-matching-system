import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
      {/* 🟢 PANEL TRÁI: TỰ ĐỘNG ĐỔI TONE SÁNG / TỐI */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-1/2 bg-[#f8fafc] dark:bg-[#060b13] items-center justify-center p-16 border-r border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-md text-left flex flex-col items-start w-full">
          {/* 1. LOGO & BRAND NAME */}
          <div className="flex items-center gap-2 justify-start mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Equitas AI
            </span>
          </div>

          {/* 2. KHUNG ẢNH MINH HỌA */}
          <div className="w-full aspect-video bg-slate-100 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl mb-8 relative group transition-all duration-300">
            {/* Hiệu ứng glow mờ chỉ xuất hiện ở Dark Mode */}
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all duration-500" />
            <img
              src="https://res.cloudinary.com/dypm5avrx/image/upload/v1778034989/1a1d336a-f4f8-4da9-b4b5-97ff4dd42036.png"
              alt="Illustration"
              className="w-full h-full object-cover relative z-10"
            />
          </div>

          {/* 3. TIÊU ĐỀ CHÍNH */}
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight transition-colors">
            Khơi nguồn <span className="text-primary">Tiềm năng.</span>
            <br /> Phá bỏ rào cản.
          </h1>

          {/* 4. ĐOẠN MÔ TẢ PHỤ */}
          <p className="text-slate-600 dark:text-gray-400 text-base max-w-sm leading-relaxed transition-colors">
            Hệ sinh thái tuyển dụng AI, tối ưu hóa cơ hội cho người khuyết tật.
          </p>
        </div>
      </div>

      {/* 🔵 PANEL PHẢI: NƠI CHỨA FORM */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 md:p-16 bg-slate-50/50 dark:bg-[#030712] transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-[#0b0f19] p-10 md:p-12 rounded-3xl shadow-sm dark:shadow-2xl border border-slate-100 dark:border-white/5 transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
