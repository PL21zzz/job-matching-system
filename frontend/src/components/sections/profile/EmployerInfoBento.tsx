import Card from "@/src/components/ui/Card";
import { Accessibility, Building2, FileText, Info, MapPin } from "lucide-react";
import BentoCard from "./BentoCard";

interface EmployerInfoBentoProps {
  profile: any;
}

export default function EmployerInfoBento({ profile }: EmployerInfoBentoProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Khối thông tin cốt lõi */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
          <Building2 size={14} className="text-primary" /> Thông tin doanh
          nghiệp
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <BentoCard
              icon={Building2}
              label="Tên công ty"
              value={profile?.employerProfile?.companyName || "Chưa cập nhật"}
            />
          </div>
          <BentoCard
            icon={FileText}
            label="Mã số thuế"
            value={profile?.employerProfile?.taxCode || "Chưa cấu hình"}
          />

          <Card
            layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-27.5"
            className="md:col-span-3"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <MapPin size={14} className="text-primary" /> Địa chỉ văn phòng
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
              {profile?.employerProfile?.address ||
                "Chưa cập nhật vị trí văn phòng chính."}
            </p>
          </Card>

          <Card
            layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-35"
            className="md:col-span-3"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <Info size={14} className="text-primary" /> Mô tả hoạt động doanh
              nghiệp
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {profile?.employerProfile?.description ||
                "Doanh nghiệp chưa cập nhật bảng giới thiệu tóm tắt."}
            </p>
          </Card>
        </div>
      </div>

      {/* Khối hạ tầng trợ năng doanh nghiệp */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1 border-l-2 border-primary/60">
          <Accessibility size={14} className="text-primary" /> Tiện ích hạ tầng
        </div>

        <Card
          layoutClassName="p-8 md:p-10 relative overflow-hidden"
          className="border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent rounded-[2.5rem]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest mb-8">
            <Accessibility size={20} /> Hạ tầng trợ năng hỗ trợ người khuyết tật
            hiện có
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              title="Lối đi xe lăn"
              desc={
                profile?.employerProfile?.accessibilityFeatures ||
                "Sẵn có tại sảnh chính và các tầng văn phòng làm việc."
              }
            />
            <FeatureCard
              title="Hỗ trợ khiếm thính"
              desc="Hệ thống phiên dịch ngôn ngữ ký hiệu ảo tích hợp tại phòng họp trung tâm."
            />
            <FeatureCard
              title="Phòng vệ sinh trợ năng"
              desc="Hệ thống tay vịn trợ lực đạt tiêu chuẩn tiếp cận hòa nhập quốc tế."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-primary/20 bg-white/50 dark:bg-[#0c1322] shadow-lg shadow-primary/5 space-y-2 transition-all duration-300">
      <h5 className="text-[11px] font-black uppercase text-primary tracking-widest">
        {title}
      </h5>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
