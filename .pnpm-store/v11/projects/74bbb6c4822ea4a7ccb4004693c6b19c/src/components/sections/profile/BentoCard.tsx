import Card from "@/src/components/ui/Card";

interface BentoCardProps {
  icon: any;
  label: string;
  value: string;
  className?: string;
}

export default function BentoCard({
  icon: Icon,
  label,
  value,
  className = "",
}: BentoCardProps) {
  return (
    <Card
      layoutClassName="p-6 space-y-3 flex flex-col justify-between min-h-27.5"
      className={`hover:border-primary/30 transition-colors group ${className}`}
    >
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <Icon
          size={14}
          className="text-primary group-hover:scale-110 transition-transform"
        />{" "}
        {label}
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
        {value}
      </p>
    </Card>
  );
}
