"use client";

import { Mail, MapPin, Zap } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-surface border-t border-slate-200/50 dark:border-border-subtle pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Cột 1: Thương hiệu */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Equitas AI
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
            Equitas AI đồng hành xóa nhòa ranh giới, kết nối tiềm năng, mang lại
            cơ hội làm việc bình đẳng cho người khuyết tật thông qua sức mạnh
            của trí tuệ nhân tạo.
          </p>
        </div>

        {/* Cột 2 & 3: Links */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-950 dark:text-white text-sm uppercase tracking-wider">
              Ứng Viên
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-gray-400 font-medium">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-primary transition-colors"
                >
                  Tìm kiếm việc làm
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Tạo CV với AI
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  Hỗ trợ tiếp cận
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-950 dark:text-white text-sm uppercase tracking-wider">
              Doanh Nghiệp
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-gray-400 font-medium">
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/employer"
                  className="hover:text-primary transition-colors"
                >
                  Giải pháp nhân sự
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="hover:text-primary transition-colors"
                >
                  Chính sách đa dạng
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-slate-950 dark:text-white text-sm uppercase tracking-wider">
              Liên Hệ
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-gray-400 font-medium">
              <li className="flex items-center gap-2 group cursor-pointer">
                <Mail
                  size={16}
                  className="text-primary group-hover:scale-110 transition-transform"
                />
                <span className="group-hover:text-primary transition-colors">
                  contact@equitas.ai
                </span>
              </li>
              <li className="flex items-center gap-2 group cursor-pointer">
                <MapPin
                  size={16}
                  className="text-primary group-hover:scale-110 transition-transform"
                />
                <span className="group-hover:text-primary transition-colors">
                  Đà Nẵng, Việt Nam
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng Copyright cuối cùng */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">
          &copy; 2026 Equitas AI. Bảo lưu mọi quyền hành.
        </p>
        <div className="flex gap-6 text-xs text-slate-400 dark:text-gray-500 font-bold uppercase tracking-tighter">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Điều khoản
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Bảo mật
          </Link>
        </div>
      </div>
    </footer>
  );
};
