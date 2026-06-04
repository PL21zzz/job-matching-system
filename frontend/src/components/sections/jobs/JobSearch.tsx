import { MapPin, Search, Sparkles } from "lucide-react";

interface JobSearchProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const JobSearch = ({ filters, setFilters }: JobSearchProps) => {
  return (
    <section className="py-12 bg-white dark:bg-surface border-b border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 p-2 bg-surface dark:bg-secondary border border-slate-200 dark:border-white/10 rounded-4xl shadow-xl">
          <div className="flex-1 flex items-center gap-3 px-6 py-3">
            <Search className="text-primary" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Vị trí công việc, kỹ năng..."
              className="bg-transparent w-full outline-none text-sm font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-white/10 self-center" />
          {/* Ô tìm kiếm địa điểm */}
          <div className="flex-1 flex items-center gap-3 px-6 py-3">
            <MapPin className="text-primary" size={20} />
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="Thành phố hoặc khu vực"
              className="bg-transparent w-full outline-none text-sm font-medium placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
          </div>
          <button className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-3xl font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
            Tìm kiếm <Sparkles size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;
