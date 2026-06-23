import Card from "@/src/components/ui/Card";
import { parseJobAccessibility } from "@/src/lib/job-accessibility";
import { Accessibility } from "lucide-react";

interface JobAccessibilityProps {
  job: any;
}

export default function JobAccessibility({ job }: JobAccessibilityProps) {
  const parsed = parseJobAccessibility(
    job.accessibilityFeatures || job.employer?.accessibilityFeatures,
  );

  return (
    <Card layoutClassName="p-6 sm:p-8 space-y-6">
      <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
        <Accessibility size={16} /> Đặc quyền trợ năng & hòa nhập vị trí này
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border-subtle space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Nhóm khuyết tật được ưu tiên
          </span>
          <div className="flex flex-wrap gap-2">
            {job.suitableDisabilities && job.suitableDisabilities.length > 0 ? (
              job.suitableDisabilities.map((disability: any) => (
                <span
                  key={disability.id}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
                >
                  {disability.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Không giới hạn
              </span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border-subtle space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Accommodation trợ năng
          </span>
          <div className="flex flex-wrap gap-2">
            {parsed.tags.length > 0 ? (
              parsed.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Theo tiêu chuẩn chung
              </span>
            )}
          </div>
        </div>
      </div>

      {parsed.groups.length > 0 && (
        <div className="grid gap-4">
          {parsed.groups.map((group) => (
            <div
              key={`${group.disabilityTypeId}-${group.disabilityTypeName}`}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary p-5"
            >
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {group.disabilityTypeName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.accommodations.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
