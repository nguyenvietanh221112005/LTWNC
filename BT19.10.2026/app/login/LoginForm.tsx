"use client";

import { useActionState } from "react";
import { credentialsSignIn, googleSignIn } from "./actions";

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(
    credentialsSignIn,
    undefined,
  );

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue="admin@shop.vn"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            defaultValue="Admin@123"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        hoặc
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form action={googleSignIn}>
        <button
          type="submit"
          className="w-full rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Đăng nhập với Google
        </button>
      </form>

      <p className="text-xs text-zinc-500">
        Tài khoản mẫu: <code>admin@shop.vn</code> / <code>Admin@123</code>{" "}
        (admin) hoặc <code>user@shop.vn</code> / <code>User@123</code> (user).
      </p>
    </div>
  );
}
