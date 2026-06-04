import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { CheckCircle2, Edit3 } from "lucide-react";
import Link from "next/link";

interface ProfileHeroHeaderProps {
  profile: any;
}

export default function ProfileHeroHeader({ profile }: ProfileHeroHeaderProps) {
  return (
    <Card layoutClassName="p-8 md:p-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none"></div>

      {/* Avatar viền Neon */}
      <div className="relative shrink-0 w-28 h-28">
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-purple-600 blur-md opacity-40"></div>
        <div className="w-full h-full rounded-full bg-linear-to-tr from-primary to-purple-600 p-1 relative z-10 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="w-full h-full rounded-full bg-white dark:bg-surface flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 bg-white dark:bg-surface p-1.5 rounded-full z-20 shadow-md border border-slate-200 dark:border-border-subtle">
          <CheckCircle2 size={16} className="text-primary" />
        </div>
      </div>

      <div className="text-center sm:text-left space-y-2.5 z-10 flex-1">
        <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white leading-none">
          {profile?.fullName || "Chưa cập nhật tên"}
        </h1>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">
          {profile?.email}
        </p>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
          <Link href="/profile/edit" className="w-fit">
            <Button className="py-2.5 px-5 normal-case text-[11px]">
              <Edit3 size={13} /> Chỉnh sửa profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
