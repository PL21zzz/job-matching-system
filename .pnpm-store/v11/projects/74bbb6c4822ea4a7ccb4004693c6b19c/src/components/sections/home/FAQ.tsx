"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "../../ui/SectionHeading";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Equitas AI hoạt động thế nào?",
      a: "Chúng tôi dùng AI để so khớp yêu cầu hỗ trợ của ứng viên với cơ sở hạ tầng của doanh nghiệp.",
    },
    {
      q: "Có mất phí ứng tuyển không?",
      a: "Hoàn toàn miễn phí cho người lao động khuyết tật.",
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white dark:bg-secondary transition-colors">
      <SectionHeading title="Câu Hỏi Thường Gặp" />
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-surface rounded-2xl border border-slate-150 dark:border-white/5 overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              suppressHydrationWarning
              className="w-full p-6 text-left font-bold text-slate-900 dark:text-white flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/1"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`text-primary transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-75 border-t border-slate-100 dark:border-white/5" : "max-h-0 opacity-0"}`}
            >
              <div className="p-6 text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
