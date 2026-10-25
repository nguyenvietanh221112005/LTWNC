import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Trang riêng tư — không cho bot lập chỉ mục (slide 30, Buổi 8)
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  // Lớp bảo vệ #2: Middleware đã chặn sớm, nhưng page vẫn tự kiểm tra lại
  // trước khi lấy/hiển thị dữ liệu — không chỉ dựa vào 1 lớp duy nhất.
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Trang riêng tư — chỉ hiển thị cho người đã đăng nhập.
      </p>

      <div className="mt-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm">
          Xin chào <strong>{session.user.name}</strong> — email:{" "}
          {session.user.email} — vai trò: <code>{session.user.role}</code>
        </p>
      </div>

      {session.user.role === "admin" && (
        <p className="mt-4 text-sm text-zinc-500">
          Bạn có quyền admin — vào{" "}
          <a className="underline" href="/admin">
            trang quản trị
          </a>{" "}
          để quản lý sản phẩm.
        </p>
      )}
    </div>
  );
}
