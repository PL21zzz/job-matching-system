"use client";

import Link from "next/link";
import { Contrast, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(() =>
    typeof window === "undefined"
      ? 100
      : Number(localStorage.getItem("font_scale") || 100),
  );
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const savedScale = Number(localStorage.getItem("font_scale") || 100);
    const highContrast = localStorage.getItem("high_contrast") === "true";
    document.documentElement.style.fontSize = `${savedScale}%`;
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, []);

  const updateScale = (next: number) => {
    const safe = Math.min(130, Math.max(90, next));
    setFontScale(safe);
    document.documentElement.style.fontSize = `${safe}%`;
    localStorage.setItem("font_scale", String(safe));
  };

  const toggleContrast = () => {
    const enabled = !document.documentElement.classList.contains("high-contrast");
    document.documentElement.classList.toggle("high-contrast", enabled);
    localStorage.setItem("high_contrast", String(enabled));
  };

  const readPage = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const selected = window.getSelection()?.toString().trim();
    const content =
      selected ||
      document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim();
    if (!content) return;
    const utterance = new SpeechSynthesisUtterance(content.slice(0, 12000));
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const reset = () => {
    updateScale(100);
    document.documentElement.classList.remove("high-contrast");
    localStorage.removeItem("high_contrast");
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return (
    <aside className="fixed bottom-4 left-4 z-60" aria-label="Cong cu tro nang">
      {open && (
        <div className="mb-3 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-surface">
          <p className="mb-3 font-bold">Tro nang thi giac</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateScale(fontScale - 10)}
              className="a11y-button"
            >
              <Minus size={16} /> Chu nho
            </button>
            <button
              onClick={() => updateScale(fontScale + 10)}
              className="a11y-button"
            >
              <Plus size={16} /> Chu lon
            </button>
            <button onClick={toggleContrast} className="a11y-button">
              <Contrast size={16} /> Tuong phan
            </button>
            <button onClick={readPage} className="a11y-button">
              {speaking ? <Pause size={16} /> : <Play size={16} />}
              {speaking ? "Dung doc" : "Doc trang"}
            </button>
          </div>
          <button
            onClick={reset}
            className="a11y-button mt-2 w-full justify-center"
          >
            <RotateCcw size={16} /> Dat lai
          </button>
          <Link
            href="/assistant"
            className="a11y-button mt-2 w-full justify-center"
          >
            AI tim viec
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="rounded-full bg-slate-950 px-5 py-3 font-bold text-white shadow-xl focus-visible:outline-4 focus-visible:outline-primary"
      >
        Tro nang
      </button>
    </aside>
  );
}
