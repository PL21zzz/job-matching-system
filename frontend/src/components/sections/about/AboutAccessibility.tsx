import { Accessibility, Eye, MousePointer2, Type } from "lucide-react";

const AboutAccessibility = () => (
  <section className="py-24 max-w-7xl mx-auto px-4">
    <div className="bg-slate-50 dark:bg-surface rounded-[3rem] p-12 md:p-20 border border-slate-100 dark:border-white/5 grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold dark:text-white leading-tight">
          Thiết Kế Vì <br />{" "}
          <span className="text-primary italic">Sự Hòa Nhập Toàn Diện</span>
        </h2>
        <p className="text-slate-500 dark:text-gray-400">
          Chúng tôi tuân thủ nghiêm ngặt các tiêu chuẩn tiếp cận nội dung web
          (WCAG) để đảm bảo Equitas AI là công cụ hỗ trợ đắc lực nhất cho mọi
          người dùng.
        </p>
        <div className="space-y-4">
          {[
            {
              icon: Eye,
              text: "Giao diện độ tương phản cao, hỗ trợ người khiếm thị nhẹ.",
            },
            {
              icon: Type,
              text: "Tối ưu hóa khả năng đọc cho các phần mềm Screen Reader.",
            },
            {
              icon: MousePointer2,
              text: "Điều hướng dễ dàng chỉ với bàn phím cho người khuyết tật vận động.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon size={18} />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative aspect-square bg-white dark:bg-secondary rounded-full border-8 border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
        <Accessibility
          size={200}
          className="text-primary/20 absolute animate-pulse"
        />
        <div className="z-10 text-center p-8">
          <h3 className="text-5xl font-black text-primary mb-2 italic">
            WCAG 2.1
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            International Standard
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutAccessibility;
