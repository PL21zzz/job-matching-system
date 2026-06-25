"use client";

import { storyService, Story } from "@/src/services/storyService";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHeading } from "../../ui/SectionHeading";

export default function Testimonials() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    storyService.list().then((data) => setStories(data.slice(0, 3))).catch(() => undefined);
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="border-y border-slate-100 bg-white py-16 transition-colors dark:border-white/5 dark:bg-secondary md:py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Câu Chuyện Thành Công"
          description="Chia sẻ thực tế do chính ứng viên Equitas đăng tải."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.id} className="space-y-5 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-white/5 dark:bg-surface sm:p-8">
              <div className="flex gap-1 text-amber-400" aria-label="Câu chuyện nổi bật">
                {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
              </div>
              <h3 className="text-lg font-black">{story.title}</h3>
              <p className="line-clamp-5 text-sm italic leading-relaxed text-slate-600 dark:text-gray-300">
                “{story.content}”
              </p>
              <footer className="border-t border-slate-200/50 pt-4 dark:border-white/5">
                <p className="font-extrabold">{story.authorName}</p>
                <p className="mt-0.5 text-xs text-slate-500">{story.authorRole}</p>
              </footer>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Link href="/stories" className="inline-flex items-center gap-2 font-bold text-primary">
            Xem tất cả câu chuyện <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
