import { BarChart3, Layers, SearchCheck, Zap } from "lucide-react";

const EmployerFeatures = () => (
  <section className="py-24 max-w-7xl mx-auto px-4">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-3xl md:text-5xl font-black dark:text-white uppercase">
        Tính Năng Đột Phá
      </h2>
      <p className="text-slate-500 max-w-2xl mx-auto italic">
        Tối ưu hóa quy trình tuyển dụng bằng trí tuệ nhân tạo chuyên biệt.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Tính năng lớn 1 */}
      <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-all">
        <Zap
          className="text-primary mb-6 group-hover:scale-110 transition-transform"
          size={40}
        />
        <h3 className="text-2xl font-bold dark:text-white mb-4">
          AI Matchmaker Độc Quyền
        </h3>
        <p className="text-slate-500 dark:text-gray-400 leading-relaxed">
          Không chỉ dừng lại ở từ khóa, AI của chúng tôi phân tích sâu sự tương
          thích giữa năng lực ứng viên và các tiện ích trợ năng tại văn phòng
          của bạn, đưa ra Match Score chính xác đến 99%.
        </p>
      </div>

      {/* Tính năng nhỏ 1 */}
      <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-all">
        <BarChart3
          className="text-purple-500 mb-6 group-hover:scale-110 transition-transform"
          size={40}
        />
        <h3 className="text-xl font-bold dark:text-white mb-4">
          DE&I Analytics
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Báo cáo trực quan về mức độ đa dạng và hòa nhập, giúp doanh nghiệp xây
          dựng thương hiệu tuyển dụng nhân văn.
        </p>
      </div>

      {/* Tính năng nhỏ 2 */}
      <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-all">
        <SearchCheck
          className="text-green-500 mb-6 group-hover:scale-110 transition-transform"
          size={40}
        />
        <h3 className="text-xl font-bold dark:text-white mb-4">
          Accessibility Audit
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Tự động đánh giá và gợi ý các cải thiện về hạ tầng văn phòng để đón
          nhận nhân sự đa dạng.
        </p>
      </div>

      {/* Tính năng lớn 2 */}
      <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-all">
        <Layers
          className="text-orange-500 mb-6 group-hover:scale-110 transition-transform"
          size={40}
        />
        <h3 className="text-2xl font-bold dark:text-white mb-4">
          Quản lý tập trung (ATS)
        </h3>
        <p className="text-slate-500 dark:text-gray-400 leading-relaxed">
          Hệ thống quản lý ứng viên thông minh, tích hợp quy trình phỏng vấn và
          phản hồi tự động, giúp HR tiết kiệm 70% thời gian vận hành.
        </p>
      </div>
    </div>
  </section>
);

export default EmployerFeatures;
