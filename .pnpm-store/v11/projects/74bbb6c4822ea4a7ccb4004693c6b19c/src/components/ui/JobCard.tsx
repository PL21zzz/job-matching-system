import { ArrowRight, Briefcase, Building, MapPin } from "lucide-react";
import Link from "next/link";

export const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  tags = [],
}: any) => (
  <div className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/5 dark:border-white/5 dark:bg-white/2 md:flex-row md:items-center">
    <div className="flex items-start gap-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/50 bg-white text-primary shadow-sm dark:border-white/5 dark:bg-secondary">
        <Building size={24} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-gray-400">
          <span className="font-semibold text-primary">{company}</span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={14} /> {type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag: string, i: number) => (
            <span
              key={`${tag}-${i}`}
              className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-row items-center justify-between gap-4 border-t border-slate-200/50 pt-4 dark:border-white/5 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0">
      <span className="text-lg font-extrabold text-primary">{salary}</span>
      <Link
        href={id ? `/jobs/${id}` : "/jobs"}
        className="flex items-center gap-2 rounded-xl border border-primary/30 bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground dark:bg-secondary"
      >
        Xem chi tiết <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);
