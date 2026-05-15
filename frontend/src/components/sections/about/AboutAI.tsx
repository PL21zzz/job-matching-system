import { BarChart3, Fingerprint, Layers, SearchCheck } from "lucide-react";
import { SectionHeading } from "../../ui/SectionHeading";

const AboutAI = () => (
  <section className="py-24 max-w-7xl mx-auto px-4">
    <SectionHeading
      title="Lõi Công Nghệ Nhân Văn"
      description="Cách chúng tôi vận hành thuật toán để tạo ra sự tương thích."
    />
    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        {
          icon: Fingerprint,
          title: "Biometric Profile",
          desc: "Hồ sơ ứng viên được mã hóa dựa trên khả năng tiếp cận đặc thù.",
        },
        {
          icon: SearchCheck,
          title: "Accessibility Audit",
          desc: "Tự động đánh giá môi trường doanh nghiệp qua dữ liệu đầu vào.",
        },
        {
          icon: Layers,
          title: "Match Engine",
          desc: "Thuật toán học máy khớp lệnh dựa trên kỹ năng và tiện ích hỗ trợ.",
        },
        {
          icon: BarChart3,
          title: "Inclusion Analytics",
          desc: "Báo cáo mức độ đa dạng và hòa nhập cho doanh nghiệp.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 hover:bg-primary/5 transition-all group"
        >
          <item.icon
            className="text-primary mb-6 group-hover:rotate-12 transition-transform"
            size={40}
          />
          <h3 className="text-lg font-bold dark:text-white mb-3">
            {item.title}
          </h3>
          <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default AboutAI;
