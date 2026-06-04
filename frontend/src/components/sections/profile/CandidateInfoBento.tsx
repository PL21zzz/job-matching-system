import Card from "@/src/components/ui/Card";
import {
  Accessibility,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import BentoCard from "./BentoCard";

interface CandidateInfoBentoProps {
  profile: any;
}

export default function CandidateInfoBento({
  profile,
}: CandidateInfoBentoProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
        <Zap size={14} className="text-primary" /> Thông tin cá nhân ứng viên
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <BentoCard
          icon={Calendar}
          label="Ngày sinh"
          value={
            profile?.candidateProfile?.dob
              ? new Date(profile.candidateProfile.dob).toLocaleDateString(
                  "vi-VN",
                )
              : "Chưa cập nhật"
          }
        />
        <BentoCard
          icon={Phone}
          label="Số điện thoại"
          value={profile?.candidateProfile?.phone || "Chưa cập nhật"}
        />
        <BentoCard
          icon={Accessibility}
          label="Loại trợ năng khuyết tật"
          value={
            profile?.candidateProfile?.disabilityType?.name || "Chưa cấu hình"
          }
        />

        <Card layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-27.5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <ShieldCheck size={14} className="text-primary" /> Trạng thái hồ sơ
          </div>
          <p className="text-sm font-black text-primary flex items-center gap-1.5 uppercase tracking-wide">
            Đã xác thực danh tính
          </p>
        </Card>

        <Card
          layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-27.5"
          className="md:col-span-2 lg:col-span-4"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <MapPin size={14} className="text-primary" /> Địa chỉ cư trú
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            {profile?.candidateProfile?.address ||
              "Chưa cập nhật chi tiết địa chỉ thường trú."}
          </p>
        </Card>
      </div>
    </div>
  );
}
