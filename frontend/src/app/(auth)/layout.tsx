import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* 🟢 PANEL TRÁI: CỐ ĐỊNH CHO TOÀN BỘ AUTH */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-1/2 bg-[#0f172a] items-center justify-center p-12 border-r border-white/5">
        <div className="max-w-md text-center flex flex-col items-center">
          <div className="flex items-center gap-2 justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Equitas AI
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tighter">
            Khơi nguồn <span className="text-primary">Tiềm năng.</span>
            <br /> Phá bỏ rào cản.
          </h1>

          <p className="text-gray-400 text-base mb-8 max-w-sm">
            Hệ sinh thái tuyển dụng AI, tối ưu hóa cơ hội cho người khuyết tật.
          </p>

          <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <img
              src="https://res.cloudinary.com/dypm5avrx/image/upload/v1776512351/Screenshot_2026-04-18_183823_lnqmy9.png"
              alt="Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 🔵 PANEL PHẢI: NƠI HIỂN THỊ CÁC FORM */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-8 md:p-16 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
