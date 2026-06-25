import ProvinceSelect from "@/src/components/ui/ProvinceSelect";
import { MapPin, Search, Sparkles } from "lucide-react";

interface JobSearchProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const JobSearch = ({ filters, setFilters }: JobSearchProps) => {
  return (
    <section className="border-b border-slate-100 bg-white py-12 dark:border-white/5 dark:bg-surface">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 rounded-4xl border border-slate-200 bg-surface p-2 shadow-xl dark:border-white/10 dark:bg-secondary md:flex-row">
          <div className="flex min-h-[56px] flex-1 items-center gap-3 px-6 py-3">
            <Search className="text-primary" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Vị trí công việc, kỹ năng..."
              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />
          </div>

          <div className="hidden h-10 w-px self-center bg-slate-200 dark:bg-white/10 md:block" />

          <div className="flex min-h-[56px] flex-1 items-center gap-3 px-6 py-3">
            <MapPin className="shrink-0 text-primary" size={20} />
            <ProvinceSelect
              value={filters.location}
              onChange={(value) => setFilters({ ...filters, location: value })}
              className="w-full"
              buttonClassName="pr-1 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          <button className="flex items-center justify-center gap-2 rounded-3xl bg-primary px-10 py-4 font-extrabold text-white shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary-hover">
            Tìm kiếm <Sparkles size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;
