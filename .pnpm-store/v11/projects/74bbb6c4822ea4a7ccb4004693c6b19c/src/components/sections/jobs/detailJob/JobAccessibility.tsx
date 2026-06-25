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
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
        <Accessibility size={16} /> Hỗ trợ phù hợp cho vị trí này
      </h4>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-border-subtle dark:bg-secondary">
          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Nhóm khuyết tật được ưu tiên
          </span>
          <div className="flex flex-wrap gap-2">
            {job.suitableDisabilities && job.suitableDisabilities.length > 0 ? (
              job.suitableDisabilities.map((disability: any) => (
                <span
                  key={disability.id}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400"
                >
                  {disability.name}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-slate-400">
                Không giới hạn
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
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-secondary"
            >
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {group.disabilityTypeName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.accommodations.map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {parsed.officeFacilities.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-secondary">
          <p className="text-sm font-black text-slate-900 dark:text-white">
            Tiện ích hạ tầng sẵn có tại doanh nghiệp
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {parsed.officeFacilities.map((item) => (
              <span
                key={item}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
