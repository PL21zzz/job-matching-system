const EmployerPricing = () => (
  <section className="py-24 max-w-7xl mx-auto px-4">
    <div className="text-center mb-20">
      <h2 className="text-4xl font-black dark:text-white uppercase italic">
        Gói dịch vụ linh hoạt
      </h2>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          name: "Miễn phí",
          price: "0đ",
          features: [
            "5 Tin tuyển dụng/tháng",
            "AI lọc sơ bộ",
            "Quản lý 5 ứng viên",
          ],
        },
        {
          name: "Professional",
          price: "2.5tr",
          features: [
            "Không giới hạn tin đăng",
            "AI Smart Matching nâng cao",
            "Báo cáo DE&I chi tiết",
            "Hỗ trợ 24/7",
          ],
          hot: true,
        },
        {
          name: "Enterprise",
          price: "Liên hệ",
          features: [
            "Tùy chỉnh giải pháp riêng",
            "Đào tạo văn hóa hòa nhập",
            "Tích hợp API hệ thống nội bộ",
          ],
        },
      ].map((plan, i) => (
        <div
          key={i}
          className={`p-10 rounded-[3rem] border transition-all ${plan.hot ? "bg-surface border-primary shadow-2xl shadow-primary/10 scale-105" : "bg-surface/50 border-border-subtle opacity-80"}`}
        >
          <h3 className="text-2xl font-black mb-2 dark:text-white uppercase">
            {plan.name}
          </h3>
          <div className="text-4xl font-black text-primary mb-8">
            {plan.price}{" "}
            <span className="text-sm font-normal text-slate-500">/tháng</span>
          </div>
          <ul className="space-y-4 mb-10">
            {plan.features.map((f) => (
              <li key={f} className="text-sm text-slate-500 dark:text-gray-400">
                ✔ {f}
              </li>
            ))}
          </ul>
          <button
            className={`w-full py-4 rounded-2xl font-black transition-all ${plan.hot ? "bg-primary text-white hover:bg-primary-hover shadow-xl shadow-primary/20" : "border border-primary text-primary hover:bg-primary/5"}`}
          >
            Chọn ngay
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default EmployerPricing;
