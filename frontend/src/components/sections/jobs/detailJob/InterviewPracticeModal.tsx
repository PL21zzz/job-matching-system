"use client";

import { authService } from "@/src/services/authService";
import {
  InterviewHistoryItem,
  jobService,
} from "@/src/services/jobService";
import { Loader2, MessageSquare, SendHorizonal, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

function extractInterviewReply(content: string) {
  if (!content) return "";

  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1]?.trim() || trimmed;

  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed?.reply === "string" && parsed.reply.trim()) {
      return parsed.reply.trim();
    }
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        const parsed = JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
        if (typeof parsed?.reply === "string" && parsed.reply.trim()) {
          return parsed.reply.trim();
        }
      } catch {
        return trimmed;
      }
    }
  }

  return trimmed;
}

export default function InterviewPracticeModal({
  isOpen,
  onClose,
  job,
}: InterviewPracticeModalProps) {
  const TOTAL_QUESTIONS = 3;
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [focusPoints, setFocusPoints] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"checking" | "ready" | "blocked">("checking");
  const [blockMessage, setBlockMessage] = useState("");
  const [disabilityLabel, setDisabilityLabel] = useState("");
  const [serverQuestionNumber, setServerQuestionNumber] = useState(1);
  const [serverTotalQuestions, setServerTotalQuestions] = useState(TOTAL_QUESTIONS);
  const [serverCompleted, setServerCompleted] = useState(false);

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
      setDisabilityLabel("");
      setServerQuestionNumber(1);
      setServerTotalQuestions(TOTAL_QUESTIONS);
      setServerCompleted(false);

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

      setDisabilityLabel(
        profile?.candidateProfile?.disabilityType?.name ||
          "Chưa khai báo nhóm khuyết tật",
      );

      try {
        const response = await jobService.practiceInterview(job.id, {});
        if (ignore) return;

        setMessages([
          {
            role: "assistant",
            content: extractInterviewReply(response.reply),
          },
        ]);
        setFocusPoints(response.focusPoints || []);
        setServerQuestionNumber(response.currentQuestion || 1);
        setServerTotalQuestions(response.totalQuestions || TOTAL_QUESTIONS);
        setServerCompleted(Boolean(response.isCompleted));
        if (response.disabilityTypeLabel) {
          setDisabilityLabel(response.disabilityTypeLabel);
        }
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

  const userAnswerCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  );

  const isInterviewCompleted = serverCompleted || userAnswerCount >= TOTAL_QUESTIONS;

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      bottomAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [messages, loading, isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading || mode !== "ready") {
      return;
    }

    if (isInterviewCompleted) {
      toast("Buổi tập này đã hoàn thành, bạn có thể đóng modal và mở lại để tập vòng mới.");
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
        {
          role: "assistant",
          content: extractInterviewReply(response.reply),
        },
      ]);
      setFocusPoints(response.focusPoints || []);
      setServerQuestionNumber(response.currentQuestion || serverQuestionNumber);
      setServerTotalQuestions(response.totalQuestions || TOTAL_QUESTIONS);
      setServerCompleted(Boolean(response.isCompleted));
      if (response.disabilityTypeLabel) {
        setDisabilityLabel(response.disabilityTypeLabel);
      }
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
      <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-surface">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
              Phỏng vấn thử với AI
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
                Tiến độ: {Math.min(serverQuestionNumber, serverTotalQuestions)}/{serverTotalQuestions}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-white/10 dark:text-slate-200">
                Hồ sơ trợ năng: {disabilityLabel || "Đang tải..."}
              </span>
            </div>
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

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex min-h-0 flex-col border-b border-slate-200 dark:border-white/10 lg:border-b-0 lg:border-r">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
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

              {isInterviewCompleted && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Buổi tập đã đủ {TOTAL_QUESTIONS}/{TOTAL_QUESTIONS} câu trả lời. Phần phản hồi cuối của AI phía trên chính là phần tổng kết để bạn demo.
                </div>
              )}

              <div ref={bottomAnchorRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 px-5 py-4 dark:border-white/10 sm:px-6"
            >
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={mode !== "ready" || loading || isInterviewCompleted}
                  rows={2}
                  placeholder="Nhập câu trả lời của bạn cho câu hỏi phỏng vấn..."
                  className="max-h-36 min-h-[88px] flex-1 resize-y rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary disabled:opacity-60 dark:border-white/10 dark:bg-secondary"
                />
                <button
                  type="submit"
                  disabled={mode !== "ready" || loading || isInterviewCompleted}
                  className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-black text-white transition hover:bg-primary-hover disabled:opacity-60 sm:w-40"
                >
                  <SendHorizonal size={18} /> Gửi trả lời
                </button>
              </div>

            </form>
          </div>

          <aside className="min-h-0 overflow-y-auto space-y-5 bg-slate-50 px-5 py-5 dark:bg-secondary sm:px-6">
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

            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-surface">
              <h4 className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
                Cách demo nhanh
              </h4>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                <li>• Mỗi buổi tập chỉ cần trả lời 3 câu là AI sẽ tổng kết.</li>
                <li>• AI đang bám theo hồ sơ trợ năng đã khai báo: {disabilityLabel || "Đang tải..."}</li>
                <li>• Sau câu trả lời cuối, AI sẽ chuyển sang nhận xét tổng hợp thay vì hỏi tiếp.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
