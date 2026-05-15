const AboutStats = () => (
  <section className="py-20 bg-slate-50/50 dark:bg-surface/50 border-y border-slate-100 dark:border-white/5">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold dark:text-white mb-4">
            Khoảng Cách <br /> Cần Được Xóa Bỏ
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Thực trạng thị trường lao động dành cho người khuyết tật hiện nay.
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              val: "7 Triệu+",
              label: "Người khuyết tật tại Việt Nam",
              color: "border-primary",
            },
            {
              val: "31.7%",
              label: "Tỷ lệ có việc làm thực tế",
              color: "border-purple-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-8 bg-white dark:bg-secondary rounded-3xl border-l-4 ${item.color} shadow-sm`}
            >
              <p className="text-4xl font-black dark:text-white mb-2">
                {item.val}
              </p>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium uppercase tracking-tighter">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutStats;
