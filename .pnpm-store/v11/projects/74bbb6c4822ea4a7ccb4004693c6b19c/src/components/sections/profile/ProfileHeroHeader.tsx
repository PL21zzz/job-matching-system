import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import AvatarBadge from "@/src/components/ui/AvatarBadge";
import { CheckCircle2, Edit3 } from "lucide-react";
import Link from "next/link";

interface ProfileHeroHeaderProps {
  profile: any;
}

export default function ProfileHeroHeader({ profile }: ProfileHeroHeaderProps) {
  return (
    <Card layoutClassName="relative flex flex-col items-center gap-8 overflow-hidden p-8 shadow-2xl group sm:flex-row md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-colors duration-500 group-hover:bg-primary/10" />

      <div className="relative h-28 w-28 shrink-0">
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-purple-600 opacity-40 blur-md" />
        <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-linear-to-tr from-primary to-purple-600 p-1 shadow-xl">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-surface">
            <AvatarBadge
              label={profile?.fullName || profile?.email}
              className="h-full w-full text-3xl"
            />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 z-20 rounded-full border border-slate-200 bg-white p-1.5 shadow-md dark:border-border-subtle dark:bg-surface">
          <CheckCircle2 size={16} className="text-primary" />
        </div>
      </div>

      <div className="z-10 flex-1 space-y-2.5 text-center sm:text-left">
        <h1 className="text-2xl font-black uppercase leading-none tracking-tight text-slate-900 dark:text-white">
          {profile?.fullName || "Chưa cập nhật tên"}
        </h1>
        <p className="text-xs font-bold tracking-wide text-slate-400 dark:text-slate-500">
          {profile?.email}
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start">
          <Link href="/profile/edit" className="w-fit">
            <Button className="px-5 py-2.5 text-[11px] normal-case">
              <Edit3 size={13} /> Chỉnh sửa profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
