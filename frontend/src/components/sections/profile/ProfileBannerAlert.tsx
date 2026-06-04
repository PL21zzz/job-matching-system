import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ProfileBannerAlert() {
  return (
    <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <ShieldAlert className="text-amber-500" size={20} />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Hồ sơ của bạn chưa hoàn thiện!
          </h4>
          <p className="text-[11px] font-medium text-slate-500 dark:text-amber-500/60 mt-0.5">
            Vui lòng cập nhật đầy đủ thông tin để AI bắt đầu kết nối việc làm
            chính xác nhé.
          </p>
        </div>
      </div>
      <Link
        href="/profile/edit"
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white dark:text-secondary text-xs font-black uppercase tracking-wider transition-all shadow-lg shrink-0 active:scale-95"
      >
        Điền hồ sơ ngay
      </Link>
    </div>
  );
}
