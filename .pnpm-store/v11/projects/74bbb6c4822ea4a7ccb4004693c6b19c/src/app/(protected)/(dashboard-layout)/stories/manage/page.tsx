"use client";

import { storyService, Story } from "@/src/services/storyService";
import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const emptyForm = {
  title: "",
  content: "",
  authorRole: "",
  status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
};

export default function ManageStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => storyService.mine().then(setStories);
  useEffect(() => {
    load().catch(() => toast.error("Không thể tải bài viết."));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await storyService.update(editingId, form);
      else await storyService.create(form);
      toast.success(editingId ? "Đã cập nhật bài viết." : "Đã đăng bài viết.");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error(String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,420px)_1fr] sm:px-6">
      <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 p-5 dark:border-white/10 sm:p-8 lg:sticky lg:top-24">
        <h1 className="text-2xl font-black">
          {editingId ? "Chỉnh sửa câu chuyện" : "Viết câu chuyện mới"}
        </h1>
        <div className="mt-6 space-y-4">
          <label className="block font-bold">
            Tiêu đề
            <input
              required
              minLength={5}
              maxLength={140}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent p-3"
            />
          </label>
          <label className="block font-bold">
            Vai trò/nghề nghiệp
            <input
              value={form.authorRole}
              onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent p-3"
            />
          </label>
          <label className="block font-bold">
            Nội dung
            <textarea
              required
              minLength={30}
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-transparent p-3 leading-7"
            />
          </label>
          <label className="block font-bold">
            Trạng thái
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900"
            >
              <option value="PUBLISHED">Đăng công khai</option>
              <option value="DRAFT">Lưu nháp</option>
            </select>
          </label>
          <button disabled={saving} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white">
            {saving ? <Loader2 className="animate-spin" /> : <Plus />}
            {editingId ? "Lưu thay đổi" : "Đăng bài"}
          </button>
        </div>
      </form>

      <section>
        <h2 className="mb-5 text-2xl font-black">Bài viết của tôi</h2>
        <div className="space-y-4">
          {stories.map((story) => (
            <article key={story.id} className="rounded-2xl bg-slate-50 p-5 dark:bg-surface sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {story.status === "PUBLISHED" ? "Công khai" : "Bản nháp"}
                  </div>
                  <h3 className="text-lg font-black">{story.title}</h3>
                  <p className="mt-2 line-clamp-3 text-slate-600 dark:text-slate-300">{story.content}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    aria-label="Sửa bài"
                    onClick={() => {
                      setEditingId(story.id);
                      setForm({
                        title: story.title || "",
                        content: story.content,
                        authorRole: story.authorRole,
                        status: story.status,
                      });
                    }}
                    className="rounded-xl border p-3"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    aria-label="Xóa bài"
                    onClick={async () => {
                      if (!confirm("Xóa bài viết này?")) return;
                      await storyService.remove(story.id);
                      await load();
                    }}
                    className="rounded-xl border border-red-200 p-3 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
