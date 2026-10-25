import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Trang công khai #1 — SEO: canonical + openGraph + JSON-LD (Organization)
export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "My Shop — cửa hàng thể thao trực tuyến: giày chạy bộ, áo thun, balo và phụ kiện chính hãng.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — Cửa hàng thể thao`,
    description:
      "Giày chạy bộ, áo thun, balo và phụ kiện thể thao chính hãng, giao nhanh toàn quốc.",
    url: "/",
    siteName: SITE_NAME,
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Cửa hàng thể thao trực tuyến chính hãng.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {SITE_NAME} — Cửa hàng thể thao
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Dự án demo Bài tập tuần 8: NextAuth (Auth.js), Middleware + RBAC 2 vai
        trò (admin, user), và SEO nâng cao với Next.js App Router.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/products"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Xem sản phẩm
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Đăng nhập
        </Link>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
