"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Đợi mount thành công trên client để tránh lệch SVG Icon lúc Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 p-3 w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 shadow-2xl active:scale-95 transition-all"
      title="Đổi giao diện"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-amber-500 animate-spin-slow" />
      ) : (
        <Moon size={20} className="text-indigo-600" />
      )}
    </button>
  );
}
