"use client";

import { clearLegacyAuthStorage } from "@/src/lib/auth-storage";
import { useAuthStore } from "@/src/store/useAuthStore";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    )
      return;
    orig.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const syncAuth = useAuthStore((state) => state.syncAuth);

  React.useEffect(() => {
    clearLegacyAuthStorage();
    void syncAuth();
  }, [syncAuth]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
