"use client";

import BlindJobAssistant from "@/src/components/assistant/BlindJobAssistant";
import { Ear, X } from "lucide-react";
import { useState } from "react";

export function BlindAssistantLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
        aria-label="Mở trợ lý giọng nói cho người mù"
      >
        <Ear size={18} />
        <span className="hidden lg:inline">Hỗ trợ người mù</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-slate-950/75 backdrop-blur-sm">
          <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4 sm:p-6">
            <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Đóng trợ lý giọng nói"
              >
                <X size={20} />
              </button>
              <BlindJobAssistant compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
