"use client";
import { FileText, Star, Users, Zap } from "lucide-react";
import { SectionHeading } from "../../ui/SectionHeading";

export default function JobCategories() {
  const categories = [
    {
      title: "Công Nghệ Thông Tin",
      count: "142 Việc làm",
      icon: Zap,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Thiết Kế & Sáng Tạo",
      count: "89 Việc làm",
      icon: Star,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Nhập Liệu & Admin",
      count: "210 Việc làm",
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Chăm Sóc Khách Hàng",
      count: "167 Việc làm",
      icon: Users,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-white dark:bg-secondary transition-colors">
      <SectionHeading
        title="Danh Mục Việc Làm Phổ Biến"
        description="Tìm kiếm cơ hội theo ngành nghề yêu thích của bạn."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-surface dark:bg-surface p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary transition-all group cursor-pointer"
          >
            <div
              className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-4 transition-colors`}
            >
              <cat.icon size={22} />
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-1 group-hover:text-primary transition-colors">
              {cat.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {cat.count}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
