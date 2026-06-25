"use client";

import { authService } from "@/src/services/authService";
import {
  CareerAssistantHistoryItem,
  CareerAssistantSuggestedJob,
  careerAssistantService,
} from "@/src/services/careerAssistantService";
import { Mic, MicOff, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedJobs?: CareerAssistantSuggestedJob[];
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export default function BlindJobAssistant({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn. Hãy bấm nút micro và nói nhu cầu tìm việc. Tôi sẽ lắng nghe, phân tích và trả lời lại bằng giọng nói.",
    },
  ]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [lastAudioUrl, setLastAudioUrl] = useState<string | null>(null);
  const [profileSummary, setProfileSummary] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(
    "Ưu tiên trải nghiệm phù hợp với người mù hoặc người khiếm thị, nội dung rõ ràng, dễ nghe và thân thiện với trình đọc màn hình.",
  );
  const [preferredLocation, setPreferredLocation] = useState("");
  const [fallbackVoiceReady, setFallbackVoiceReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAccessibilityNeeds(
      "Ưu tiên trải nghiệm tìm việc bằng giọng nói, nội dung rõ ràng, dễ nghe và mô tả công việc cụ thể theo đúng nhu cầu trợ năng của người dùng.",
    );

    authService
      .getProfileMeSafe()
      .then((user) => {
        if (!user) {
          return;
        }

        const disability = user?.candidateProfile?.disabilityType?.name;
        const summary = [
          user?.fullName ? `Ứng viên: ${user.fullName}` : "",
          disability ? `Nhóm hỗ trợ: ${disability}` : "",
          user?.candidateProfile?.address
            ? `Địa chỉ hiện tại: ${user.candidateProfile.address}`
            : "",
        ]
          .filter(Boolean)
          .join(". ");

        if (summary) {
          setProfileSummary(summary);
        }

        if (
          disability &&
          /(khiếm thị|mù|nghe nhìn|thị giác)/i.test(disability) === false
        ) {
          setAccessibilityNeeds(
            `Người dùng thuộc nhóm ${disability}. Nếu không có việc phù hợp hoàn toàn cho người mù, hãy ưu tiên công việc có mô tả trợ năng rõ ràng, giao tiếp dễ nghe và làm việc linh hoạt.`,
          );
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      setFallbackVoiceReady(true);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => {
    const summary = profileSummary.toLowerCase();

    if (!summary) {
      return;
    }

    if (
      /(khuyết tật vận động|vận động|xe lăn)/i.test(profileSummary)
    ) {
      setAccessibilityNeeds(
        "Người dùng thuộc nhóm khuyết tật vận động. Hãy ưu tiên công việc có mô tả môi trường làm việc rõ ràng, di chuyển phù hợp, ca làm cụ thể và trợ năng thực tế tại nơi làm việc.",
      );
      return;
    }

    if (/(khiếm thị|mù|thị giác)/i.test(profileSummary)) {
      setAccessibilityNeeds(
        "Người dùng thuộc nhóm khiếm thị. Hãy ưu tiên mô tả công việc rõ ràng, dễ nghe, có thông tin trợ năng cụ thể và giải thích chi tiết bằng giọng nói.",
      );
      return;
    }

    if (/(khiếm thính|điếc|thính giác)/i.test(profileSummary)) {
      setAccessibilityNeeds(
        "Người dùng thuộc nhóm khiếm thính. Hãy ưu tiên công việc có giao tiếp rõ ràng qua văn bản, quy trình cụ thể và môi trường làm việc dễ phối hợp.",
      );
      return;
    }

    if (/(câm|khó nói|ngôn ngữ)/i.test(profileSummary)) {
      setAccessibilityNeeds(
        "Người dùng thuộc nhóm câm hoặc khó nói. Hãy ưu tiên công việc có thể trao đổi qua văn bản, quy trình rõ ràng và mô tả chi tiết dễ hiểu.",
      );
    }
  }, [profileSummary]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const history = useMemo<CareerAssistantHistoryItem[]>(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  const speakWithBrowser = (text: string) => {
    if (!("speechSynthesis" in window) || !text.trim()) {
      return false;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((voice) => voice.lang.toLowerCase().includes("vi")) ||
      voices.find((voice) => /female|natural|google/i.test(voice.name)) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  };

  const waitUntilAudioReady = async (audioUrl: string) => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      try {
        const probe = new Audio(audioUrl);
        await new Promise<void>((resolve, reject) => {
          const cleanup = () => {
            probe.oncanplaythrough = null;
            probe.onerror = null;
          };

          probe.preload = "auto";
          probe.oncanplaythrough = () => {
            cleanup();
            resolve();
          };
          probe.onerror = () => {
            cleanup();
            reject(new Error("Audio chưa sẵn sàng"));
          };
          probe.load();
        });

        return true;
      } catch {
        await new Promise((resolve) => window.setTimeout(resolve, 1200));
      }
    }

    return false;
  };

  const playAudio = async (audioUrl?: string | null, fallbackText?: string) => {
    if (!audioUrl) {
      if (fallbackText) {
        speakWithBrowser(fallbackText);
      }
      return;
    }

    audioRef.current?.pause();
    window.speechSynthesis?.cancel();

    const ready = await waitUntilAudioReady(audioUrl);
    if (!ready) {
      if (fallbackText) {
        const spoken = speakWithBrowser(fallbackText);
        if (spoken) {
          toast("Đang dùng giọng đọc của trình duyệt.");
          return;
        }
      }

      toast.error("Chưa thể phát giọng nói lúc này.");
      return;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    try {
      await audio.play();
    } catch {
      if (fallbackText) {
        const spoken = speakWithBrowser(fallbackText);
        if (spoken) {
          toast("Đang dùng giọng đọc của trình duyệt.");
          return;
        }
      }

      toast.error("Trình duyệt chưa phát được âm thanh.");
    }
  };

  const askAssistant = async (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage || loading) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: cleanMessage,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setLoading(true);

    try {
      const nextHistory: CareerAssistantHistoryItem[] = [
        ...history,
        { role: "user" as const, content: cleanMessage },
      ].slice(-8);

      const response = await careerAssistantService.chat({
        message: cleanMessage,
        history: nextHistory,
        profileSummary: profileSummary || undefined,
        accessibilityNeeds: accessibilityNeeds || undefined,
        preferredLocation: preferredLocation || undefined,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: response.answer,
        suggestedJobs: response.suggestedJobs,
      };

      setMessages((current) => [...current, assistantMessage]);
      setTranscriptPreview(response.transcript);
      setLastAudioUrl(response.audioUrl || null);
      await playAudio(response.audioUrl, response.answer);
    } catch (error: unknown) {
      toast.error(
        typeof error === "string"
          ? error
          : "Trợ lý đang bận. Bạn thử nói lại sau ít phút.",
      );
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Trình duyệt này chưa hỗ trợ nhận giọng nói.");
      return;
    }

    audioRef.current?.pause();
    window.speechSynthesis?.cancel();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (transcript) {
        setTranscriptPreview(transcript);
        void askAssistant(transcript);
      }
    };

    recognition.onerror = () => {
      toast.error("Tôi nghe chưa rõ. Bạn vui lòng nói chậm và rõ hơn.");
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  return (
    <div
      className={`bg-slate-950 text-white ${compact ? "p-5 sm:p-8" : "min-h-screen px-4 py-10 sm:px-6 lg:px-8"}`}
    >
      <div className={`mx-auto ${compact ? "max-w-5xl" : "max-w-6xl"}`}>
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                Trợ lý việc làm bằng giọng nói
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Nói để tìm việc phù hợp
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
                Dành cho người mù hoặc người khiếm thị. Bạn chỉ cần bấm micro,
                nói nhu cầu của mình, hệ thống sẽ tự lắng nghe, phân tích và
                trả lời lại bằng giọng nói dễ nghe.
              </p>
            </div>

            <div className="px-6 py-8 sm:px-8">
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  disabled={loading}
                  className={`flex h-40 w-40 items-center justify-center rounded-full border text-white shadow-2xl transition focus-visible:outline-4 focus-visible:outline-cyan-300 ${
                    listening
                      ? "border-red-400 bg-red-500/90 shadow-red-500/30"
                      : "border-cyan-300/40 bg-cyan-400/20 shadow-cyan-400/20 hover:bg-cyan-400/30"
                  } ${loading ? "opacity-70" : ""}`}
                  aria-label={
                    listening
                      ? "Dừng lắng nghe"
                      : "Bắt đầu lắng nghe để tìm việc"
                  }
                >
                  {listening ? <MicOff size={58} /> : <Mic size={58} />}
                </button>

                <p className="mt-6 text-2xl font-black">
                  {listening
                    ? "Đang lắng nghe..."
                    : loading
                      ? "Đang phân tích và trả lời..."
                      : "Bấm micro để bắt đầu"}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Ví dụ: “Tôi là người khiếm thị, muốn tìm việc từ xa về nhập
                  liệu hoặc chăm sóc khách hàng”.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    Bạn vừa nói
                  </p>
                  <p className="mt-3 text-lg leading-8 text-white">
                    {transcriptPreview || "Chưa có câu nói nào được ghi nhận."}
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Volume2 size={18} />
                    <p className="text-xs font-black uppercase tracking-[0.25em]">
                      Phản hồi gần nhất
                    </p>
                  </div>
                  <p className="mt-3 text-lg leading-8 text-white">
                    {latestAssistantMessage?.content}
                  </p>
                  {(lastAudioUrl || fallbackVoiceReady) && (
                    <button
                      type="button"
                      onClick={() =>
                        void playAudio(
                          lastAudioUrl,
                          latestAssistantMessage?.content || "",
                        )
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/20"
                    >
                      <Volume2 size={16} />
                      Nghe lại
                    </button>
                  )}
                </div>

                {latestAssistantMessage?.suggestedJobs &&
                  latestAssistantMessage.suggestedJobs.length > 0 && (
                    <div className="space-y-3">
                      {latestAssistantMessage.suggestedJobs.map((job) => (
                        <Link
                          key={job.id}
                          href={job.detailPath}
                          className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/40 hover:bg-white/10"
                        >
                          <p className="text-lg font-black text-white">
                            {job.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-300">
                            {job.companyName || "Doanh nghiệp đang cập nhật"} •{" "}
                            {job.location} • {job.type}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-300">
                            {job.salaryText || "Mức lương đang thương lượng"}
                          </p>
                          {job.reasons.length > 0 && (
                            <p className="mt-2 text-sm leading-7 text-cyan-300">
                              Phù hợp vì: {job.reasons.join(", ")}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6">
              <h2 className="text-xl font-black">Tùy chỉnh thêm</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Nếu muốn, bạn có thể thêm bối cảnh để trợ lý lọc việc chính xác
                hơn. Không bắt buộc.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    Khu vực ưu tiên
                  </label>
                  <input
                    value={preferredLocation}
                    onChange={(event) => setPreferredLocation(event.target.value)}
                    placeholder="Ví dụ: Hà Nội, Đà Nẵng, làm từ xa"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    Nhu cầu trợ năng
                  </label>
                  <textarea
                    value={accessibilityNeeds}
                    onChange={(event) => setAccessibilityNeeds(event.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                    Tóm tắt hồ sơ
                  </label>
                  <textarea
                    value={profileSummary}
                    onChange={(event) => setProfileSummary(event.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-400/10 bg-cyan-400/5 p-6">
              <h2 className="text-xl font-black text-white">Cách dùng nhanh</h2>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li>1. Bấm nút micro lớn ở bên trái.</li>
                <li>2. Nói rõ nhu cầu tìm việc của bạn.</li>
                <li>3. Chờ hệ thống phản hồi bằng giọng nói.</li>
                <li>4. Mở công việc phù hợp để xem chi tiết.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
