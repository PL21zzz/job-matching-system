"use client";
import { Star } from "lucide-react";
import { SectionHeading } from "../../ui/SectionHeading";

export default function Testimonials() {
  const list = [
    {
      text: "Là một dev khiếm thính, rào cản giao tiếp từng khiến tôi mất đi nhiều cơ hội. Qua Equitas AI, tôi được kết nối trực tiếp với công ty có sẵn văn hóa hỗ trợ đặc thù.",
      user: "Nguyễn Văn Hùng",
      role: "Software Engineer",
    },
    {
      text: "Công nghệ ẩn thông tin cá nhân của AI thực sự làm thay đổi quy trình tuyển dụng của chúng tôi. Chúng tôi tập trung 100% vào năng lực thực tế.",
      user: "Chị Mai Linh",
      role: "HR Manager @ Novaha Lab",
    },
    {
      text: "Tôi bị khuyết tật vận động, việc tìm việc remote vô cùng gian nan. Nhờ bộ lọc tiện ích của hệ thống, ước mơ của tôi đã thành sự thật.",
      user: "Trần Thanh Vy",
      role: "Data Specialist",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-secondary transition-colors border-y border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          title="Câu Chuyện Thành Công"
          description="Chia sẻ thực tế từ các ứng viên và đối tác của chúng tôi."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-surface p-8 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6"
            >
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-gray-300 text-sm italic leading-relaxed">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="border-t border-slate-200/50 dark:border-white/5 pt-4">
                <p className="font-extrabold text-slate-950 dark:text-white">
                  {item.user}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
