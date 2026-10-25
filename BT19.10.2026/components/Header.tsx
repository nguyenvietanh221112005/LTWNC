"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Header là Client Component (useSession) thay vì Server Component gọi
// auth(): nếu đặt auth() trong root layout, MỌI trang (kể cả trang công khai
// /, /products) sẽ bị kéo thành Dynamic vì layout bọc toàn bộ cây trang.
// Tách phần phụ thuộc phiên ra Client Component để các trang công khai vẫn
// giữ được SSG/ISR (xem Buổi 7) — minh hoạ đúng mục "đọc phiên ở Client
// Component" của Buổi 8.
export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/">Trang chủ</Link>
          <Link href="/products">Sản phẩm</Link>
          {session?.user && <Link href="/dashboard">Dashboard</Link>}
          {session?.user?.role === "admin" && <Link href="/admin">Quản trị</Link>}
        </nav>

        {status === "loading" ? (
          <span className="text-sm text-zinc-400">...</span>
        ) : session?.user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Xin chào <strong>{session.user.name}</strong> (
              <code>{session.user.role}</code>)
            </span>
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              className="rounded-full border border-zinc-300 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
