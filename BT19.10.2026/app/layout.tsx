import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Header } from "@/components/Header";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cửa hàng thể thao`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Cửa hàng thể thao trực tuyến — giày chạy bộ, phụ kiện chính hãng.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 px-6 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
            BT Tuần 8 — NextAuth, Middleware, SEO nâng cao (Next.js)
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
