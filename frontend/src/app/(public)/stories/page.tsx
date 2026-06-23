"use client";

import { storyService, Story } from "@/src/services/storyService";
import { BookOpen, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storyService.list().then(setStories).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 dark:bg-secondary sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-bold text-primary">Cộng đồng Equitas</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Câu chuyện truyền cảm hứng
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              Góc chia sẻ thật từ các ứng viên về hành trình học tập, làm việc và
              vượt qua rào cản tiếp cận.
            </p>
          </div>
          <Link
            href="/stories/manage"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white"
          >
            <PenLine size={18} /> Viết câu chuyện
          </Link>
        </header>

        {loading ? (
          <p role="status">Đang tải bài viết...</p>
        ) : stories.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-12 text-center dark:bg-surface">
            <BookOpen className="mx-auto mb-4 text-primary" size={36} />
            <p>Chưa có câu chuyện nào. Bạn có thể là người viết đầu tiên.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-surface sm:p-8"
              >
                <h2 className="text-xl font-black">{story.title || "Câu chuyện của tôi"}</h2>
                <p className="mt-4 line-clamp-6 flex-1 leading-7 text-slate-600 dark:text-slate-300">
                  {story.content}
                </p>
                <footer className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                  <p className="font-bold">{story.authorName}</p>
                  <p className="text-sm text-slate-500">{story.authorRole}</p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
