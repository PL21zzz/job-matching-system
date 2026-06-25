import { ArrowRight, Briefcase, Building, MapPin } from "lucide-react";
import Link from "next/link";

export const JobCard = ({
  title,
  company,
  location,
  salary,
  type,
  tags,
}: any) => (
  <div className="bg-slate-50 dark:bg-white/2 p-6 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-primary transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/5 group">
    <div className="flex items-start gap-5">
      <div className="w-14 h-14 bg-white dark:bg-secondary rounded-2xl border border-slate-200/50 dark:border-white/5 flex items-center justify-center text-primary shadow-sm font-bold text-lg">
        <Building size={24} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
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
              key={i}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-slate-200/50 dark:border-white/5 pt-4 md:pt-0">
      <span className="text-lg font-extrabold text-primary">{salary}</span>
      <Link
        href="/login"
        className="bg-white dark:bg-secondary hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
      >
        Ứng Tuyển <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);
