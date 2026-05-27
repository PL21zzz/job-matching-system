import { ArrowRight, Award, Briefcase, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import FAQ from "../../components/sections/home/FAQ";
import FeaturedJobs from "../../components/sections/home/FeaturedJobs";
import Hero from "../../components/sections/home/Hero";
import JobCategories from "../../components/sections/home/JobCategories";
import Testimonials from "../../components/sections/home/Testimonials";
import Workflow from "../../components/sections/home/Workflow";
import { SectionHeading } from "../../components/ui/SectionHeading";

export default function HomePage() {
  return (
    <div className="transition-colors duration-300 bg-white dark:bg-secondary">
      {/* 1. Hero Section */}
      <Hero />

      {/* 3. Key Statistics */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, val: "+10,000", label: "Ứng viên kết nối" },
          { icon: Briefcase, val: "+5,000", label: "Tin tuyển dụng" },
          { icon: Award, val: "98%", label: "Tỷ lệ hài lòng" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-surface p-8 rounded-3xl border border-slate-100 dark:border-white/5 text-center"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <s.icon size={24} />
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
              {s.val}
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* 4. Tại sao chọn chúng tôi (Bento Grid) */}
      <section className="py-16 md:py-24 bg-white dark:bg-secondary border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <SectionHeading
            title="Tại Sao Lựa Chọn Equitas AI?"
            description="Giải pháp công nghệ đột phá tối ưu hóa cơ hội việc làm."
          />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-slate-50 dark:bg-surface p-8 rounded-3xl border border-slate-100 dark:border-white/5">
              <Zap className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-bold dark:text-white mb-2">
                AI Matchmaker Độc Quyền
              </h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Phân tích độ tương thích chính xác giữa kỹ năng ứng viên và môi
                trường doanh nghiệp.
              </p>
            </div>
            <div className="md:col-span-4 bg-slate-50 dark:bg-surface p-8 rounded-3xl border border-slate-100 dark:border-white/5">
              <Shield className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-bold dark:text-white mb-2">
                Tuyển Dụng Công Bằng
              </h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Ẩn danh thông tin nhạy cảm để loại bỏ định kiến vô thức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Job Categories */}
      <JobCategories />

      {/* 6. Featured Jobs */}
      <FeaturedJobs />

      {/* 7. Workflow */}
      <Workflow />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. FAQ */}
      <FAQ />

      {/* 10. Call To Action (Banner) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="relative bg-linear-to-tr from-primary via-primary-hover to-purple-800 rounded-3xl p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Sẵn Sàng Bắt Đầu?
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Gia nhập cộng đồng tuyển dụng thông minh và công bằng ngay hôm
              nay.
            </p>
            <div className="flex justify-center pt-4">
              <Link
                href="/register"
                className="bg-white text-primary px-8 py-4 rounded-xl font-extrabold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                Đăng Ký Miễn Phí <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
