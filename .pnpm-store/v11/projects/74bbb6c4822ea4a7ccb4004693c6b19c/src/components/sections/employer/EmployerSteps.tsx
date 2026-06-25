const EmployerSteps = () => (
  <section className="py-24 bg-white dark:bg-secondary border-y border-slate-100 dark:border-white/5">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold dark:text-white italic">
          Bắt đầu chỉ trong vài phút
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Đường kẻ nối giữa các bước - Chỉ hiện trên Desktop */}
        <div className="hidden md:block absolute top-1/4 left-0 w-full h-px border-t-2 border-dashed border-slate-200 dark:border-white/10 z-0"></div>

        {[
          {
            step: "01",
            title: "Đăng tin tuyển dụng",
            desc: "Mô tả công việc và tích chọn các tiện ích hỗ trợ hiện có tại văn phòng của bạn.",
          },
          {
            step: "02",
            title: "AI Phân tích & Gợi ý",
            desc: "Hệ thống tự động khớp lệnh với 10,000+ ứng viên và xếp hạng theo độ tương thích.",
          },
          {
            step: "03",
            title: "Kết nối tài năng",
            desc: "Phỏng vấn và tuyển dụng những ứng viên phù hợp nhất với văn hóa doanh nghiệp.",
          },
        ].map((item, i) => (
          <div key={i} className="relative z-10 text-center space-y-6 group">
            <div className="w-16 h-16 mx-auto bg-white dark:bg-surface border-2 border-primary rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
              {item.step}
            </div>
            <h4 className="text-xl font-bold dark:text-white uppercase tracking-tight">
              {item.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-gray-400 px-4">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default EmployerSteps;
