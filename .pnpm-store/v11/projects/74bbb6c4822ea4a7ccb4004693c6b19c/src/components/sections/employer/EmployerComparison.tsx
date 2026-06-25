"use client";

import { CheckCircle2, XCircle } from "lucide-react";

const EmployerComparison = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-secondary border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tiêu đề Section chuẩn cấu trúc trang chủ */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Thay Đổi Cách Bạn Nhìn Nhận Ứng Viên
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Vượt qua những rào cản truyền thống để tiếp cận lực lượng lao động
            hòa nhập.
          </p>
        </div>

        {/* Khối so sánh 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 1. Quy trình hiện tại (Cũ - Muted bớt để làm nổi bật giải pháp mới) */}
          <div className="p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-surface border border-slate-100 dark:border-white/5 flex flex-col justify-between transition-all opacity-80 hover:opacity-100">
            <div>
              <div className="flex items-center gap-3 mb-6 text-red-500 dark:text-red-400">
                <XCircle size={26} />
                <h3 className="text-lg font-extrabold uppercase tracking-wider">
                  Quy trình hiện tại
                </h3>
              </div>
              <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-gray-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    Định kiến vô thức về tình trạng và mức độ khuyết tật khi
                    duyệt CV thủ công.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    Đánh giá ứng viên qua các tiêu chí cảm tính, dễ bỏ sót nhân
                    tài thực sự.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>
                    Thiếu thông tin và dữ liệu thực tế về khả năng hỗ trợ tiếp
                    cận tại văn phòng.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Giải pháp Equitas AI (Nổi bật - Có viền Primary phát sáng) */}
          <div className="p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-surface border-2 border-primary shadow-xl shadow-primary/5 flex flex-col justify-between transition-all hover:shadow-primary/10">
            <div>
              <div className="flex items-center gap-3 mb-6 text-primary">
                <CheckCircle2 size={26} />
                <h3 className="text-lg font-extrabold uppercase tracking-wider">
                  Giải pháp Equitas AI
                </h3>
              </div>
              <ul className="space-y-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-base font-black mt-0.5">
                    ✓
                  </span>
                  <span>
                    <span className="text-primary">
                      Ẩn danh thông tin nhạy cảm:
                    </span>{" "}
                    Tập trung 100% vào bộ kỹ năng và năng lực cốt lõi của ứng
                    viên.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-base font-black mt-0.5">
                    ✓
                  </span>
                  <span>
                    <span className="text-primary">Match Score chuẩn xác:</span>{" "}
                    Thuật toán thông minh chấm điểm tương thích tự động giữa JD
                    và ứng viên.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-base font-black mt-0.5">
                    ✓
                  </span>
                  <span>
                    <span className="text-primary">
                      Hỗ trợ tiếp cận toàn diện:
                    </span>{" "}
                    Tự động đánh giá và đối chiếu hạ tầng cơ sở vật chất văn
                    phòng phù hợp.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerComparison;
