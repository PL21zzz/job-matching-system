import Card from "@/src/components/ui/Card";
import { Briefcase, MapPin, Sparkles } from "lucide-react";

interface JobHeroProps {
  job: any;
  aiMatchScore: number;
}

export default function JobHero({ job, aiMatchScore }: JobHeroProps) {
  return (
    <Card layoutClassName="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="w-20 h-20 shrink-0 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border-subtle flex items-center justify-center font-black text-primary text-xl shadow-inner select-none">
          {job.employer?.companyName?.substring(0, 2).toUpperCase() || "TG"}
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> AI Match: {aiMatchScore}%
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
              {job.employer?.companyName || "N/A"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-slate-400" />{" "}
              {job.type === "FULL_TIME"
                ? "Toàn thời gian"
                : job.type === "PART_TIME"
                  ? "Bán thời gian"
                  : "Remote"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
