import { Toaster } from "react-hot-toast";
import { ThemeToggle } from "../components/ThemeToggle";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <main>{children}</main>
          <ThemeToggle />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
