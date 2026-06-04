"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "../../ui/SectionHeading";

export default function Workflow() {
  const steps = {
    candidate: [
      { s: "Tạo hồ sơ năng lực", d: "Cung cấp kỹ năng và yêu cầu hỗ trợ." },
      {
        s: "AI gợi ý công việc",
        d: "Nhận danh sách việc làm tương thích cao nhất.",
      },
      {
        s: "Ứng tuyển và nhận việc",
        d: "Bắt đầu hành trình sự nghiệp bình đẳng.",
      },
    ],
    employer: [
      {
        s: "Đăng tin tuyển dụng",
        d: "Mô tả việc làm và tiện ích hỗ trợ sẵn có.",
      },
      {
        s: "Bộ lọc AI thông minh",
        d: "Tiếp cận ứng viên dựa trên điểm Match %.",
      },
      { s: "Xây dựng đội ngũ", d: "Thúc đẩy sự đa dạng và bền vững." },
    ],
  };

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-white dark:bg-secondary transition-colors">
      <SectionHeading
        title="Quy Trình Hoạt Động Đồng Bộ"
        description="Nền tảng đồng hành trọn vẹn cùng cả ứng viên và nhà tuyển dụng."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cột Ứng viên */}
        <div className="bg-surface dark:bg-surface p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
            Dành Cho Ứng Viên
          </h3>
          <ul className="space-y-4">
            {steps.candidate.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {step.s}
                  </h4>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all"
          >
            Tạo Hồ Sơ Với AI <ArrowRight size={16} />
          </Link>
        </div>
        {/* Cột Doanh nghiệp */}
        <div className="bg-surface dark:bg-surface p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
            Dành Cho Doanh Nghiệp
          </h3>
          <ul className="space-y-4">
            {steps.employer.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {step.s}
                  </h4>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
          >
            Đăng Tin Tuyển Dụng <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
