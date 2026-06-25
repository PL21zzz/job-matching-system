import Card from "@/src/components/ui/Card";
import { parseSelectedAccessibilityOptions } from "@/src/lib/employer-accessibility";
import {
  Accessibility,
  Building2,
  FileText,
  Info,
  MapPin,
} from "lucide-react";
import BentoCard from "./BentoCard";

interface EmployerInfoBentoProps {
  profile: any;
}

export default function EmployerInfoBento({ profile }: EmployerInfoBentoProps) {
  const accessibilityItems = parseSelectedAccessibilityOptions(
    profile?.employerProfile?.accessibilityFeatures,
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-l-2 border-primary/60 pl-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <Building2 size={14} className="text-primary" />
          Thông tin doanh nghiệp
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
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
              <MapPin size={14} className="text-primary" />
              Địa chỉ văn phòng
            </div>
            <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-200">
              {profile?.employerProfile?.address ||
                "Chưa cập nhật vị trí văn phòng chính."}
            </p>
          </Card>

          <Card
            layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-35"
            className="md:col-span-3"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <Info size={14} className="text-primary" />
              Mô tả hoạt động doanh nghiệp
            </div>
            <p className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-300">
              {profile?.employerProfile?.description ||
                "Doanh nghiệp chưa cập nhật phần giới thiệu tóm tắt."}
            </p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 border-l-2 border-primary/60 pl-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <Accessibility size={14} className="text-primary" />
          Tiện ích hạ tầng
        </div>

        <Card
          layoutClassName="p-8 md:p-10 relative overflow-hidden"
          className="rounded-[2.5rem] border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-[80px]" />

          <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary">
            <Accessibility size={20} />
            Hạ tầng trợ năng doanh nghiệp đã cấu hình
          </div>

          {accessibilityItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
              {accessibilityItems.map((item: string, index: number) => (
                <FeatureCard
                  key={`${item}-${index}`}
                  title={`Tiện ích ${index + 1}`}
                  desc={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/20 bg-white/40 p-6 text-sm font-semibold leading-relaxed text-slate-600 dark:bg-[#0c1322] dark:text-slate-300">
              Doanh nghiệp chưa cập nhật tiện ích trợ năng. Hãy vào trang chỉnh
              sửa hồ sơ để bổ sung các hạng mục như lối đi xe lăn, hỗ trợ khiếm
              thính, không gian làm việc phù hợp hoặc chính sách hỗ trợ nội bộ.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-primary/20 bg-white/50 p-6 shadow-lg shadow-primary/5 transition-all duration-300 dark:bg-[#0c1322]">
      <h5 className="text-[11px] font-black uppercase tracking-widest text-primary">
        {title}
      </h5>
      <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
        {desc}
      </p>
    </div>
  );
}
