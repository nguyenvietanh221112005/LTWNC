import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Không có quyền truy cập",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">403</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Bạn không có quyền truy cập trang này.
      </p>
      <Link href="/" className="mt-6 inline-block underline">
        Về trang chủ
      </Link>
    </div>
  );
}
