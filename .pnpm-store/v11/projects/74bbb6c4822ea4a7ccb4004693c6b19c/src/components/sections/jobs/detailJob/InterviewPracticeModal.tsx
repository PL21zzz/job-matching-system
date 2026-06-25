"use client";

import { authService } from "@/src/services/authService";
import {
  InterviewHistoryItem,
  jobService,
} from "@/src/services/jobService";
import { Loader2, MessageSquare, SendHorizonal, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface InterviewPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

type InterviewMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function InterviewPracticeModal({
  isOpen,
  onClose,
  job,
}: InterviewPracticeModalProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [focusPoints, setFocusPoints] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"checking" | "ready" | "blocked">("checking");
  const [blockMessage, setBlockMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let ignore = false;

    const bootstrap = async () => {
      setLoading(true);
      setMessages([]);
      setFocusPoints([]);
      setInput("");
      setMode("checking");
      setBlockMessage("");

      const profile = await authService.getProfileMeSafe();
      if (ignore) return;

      const role = profile?.role?.name || profile?.role;

      if (!profile) {
        setMode("blocked");
        setBlockMessage("Bạn cần đăng nhập tài khoản ứng viên để tập phỏng vấn.");
        setLoading(false);
        return;
      }

      if (role !== "Candidate") {
        setMode("blocked");
        setBlockMessage("Tính năng này hiện chỉ dành cho ứng viên.");
        setLoading(false);
        return;
      }

      try {
        const response = await jobService.practiceInterview(job.id, {});
        if (ignore) return;

        setMessages([{ role: "assistant", content: response.reply }]);
        setFocusPoints(response.focusPoints || []);
        setMode("ready");
      } catch (error) {
        if (ignore) return;
        setMode("blocked");
        setBlockMessage(String(error));
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, [isOpen, job.id]);

  const history = useMemo<InterviewHistoryItem[]>(
    () => messages.slice(-10),
    [messages],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading || mode !== "ready") {
      return;
    }

    const nextUserMessage: InterviewMessage = {
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await jobService.practiceInterview(job.id, {
        message,
        history: [...history, nextUserMessage].slice(-10),
      });

      setMessages((current) => [
        ...current,
        { role: "assistant", content: response.reply },
      ]);
      setFocusPoints(response.focusPoints || []);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-surface">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
              Phỏng vấn thử với AI
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {job.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              AI sẽ đóng vai nhà tuyển dụng và hỏi theo đúng công việc này.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
            aria-label="Đóng luyện phỏng vấn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid flex-1 gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex min-h-[28rem] flex-col border-b border-slate-200 dark:border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-3xl px-4 py-4 ${
                    message.role === "assistant"
                      ? "mr-8 bg-slate-100 text-slate-900 dark:bg-white/5 dark:text-white"
                      : "ml-8 bg-primary text-white"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.25em] opacity-80">
                    {message.role === "assistant" ? "AI Interviewer" : "Bạn"}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7">
                    {message.content}
                  </p>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  <Loader2 size={18} className="animate-spin" />
                  AI đang chuẩn bị câu hỏi hoặc phản hồi...
                </div>
              )}

              {mode === "blocked" && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  {blockMessage}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 px-5 py-4 dark:border-white/10 sm:px-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={mode !== "ready" || loading}
                  rows={3}
                  placeholder="Nhập câu trả lời của bạn cho câu hỏi phỏng vấn..."
                  className="min-h-28 flex-1 rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-primary disabled:opacity-60 dark:border-white/10 dark:bg-secondary"
                />
                <button
                  type="submit"
                  disabled={mode !== "ready" || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-4 text-sm font-black text-white transition hover:bg-primary-hover disabled:opacity-60 sm:w-44"
                >
                  <SendHorizonal size={18} /> Gửi trả lời
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-5 bg-slate-50 px-5 py-5 dark:bg-secondary sm:px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-surface">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare size={18} />
                <h4 className="text-sm font-black uppercase tracking-[0.25em]">
                  Mục tiêu buổi tập
                </h4>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <li>Nói rõ kinh nghiệm hoặc điểm mạnh liên quan trực tiếp tới job.</li>
                <li>Dùng ví dụ cụ thể thay vì trả lời chung chung.</li>
                <li>Giữ câu trả lời ngắn gọn, tự tin và đúng trọng tâm.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-surface">
              <h4 className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
                AI đang muốn bạn tập trung vào
              </h4>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {focusPoints.length > 0 ? (
                  focusPoints.map((point) => <li key={point}>• {point}</li>)
                ) : (
                  <li>• Hãy trả lời câu hỏi đầu tiên để AI phản hồi chi tiết hơn.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
