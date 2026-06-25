import { Toaster } from "react-hot-toast";
import { ThemeToggle } from "../components/ThemeToggle";
import "./globals.css";
import { Providers } from "./providers";
import { AccessibilityToolbar } from "../components/AccessibilityToolbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Equitas AI - Việc làm hòa nhập",
    template: "%s | Equitas AI",
  },
  description: "Nền tảng việc làm tiếp cận dành cho người khuyết tật.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Bỏ qua điều hướng
        </a>
        <Providers>
          <main id="main-content" tabIndex={-1}>{children}</main>
          <AccessibilityToolbar />
          <ThemeToggle />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
