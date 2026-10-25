import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Đăng nhập bằng email/mật khẩu hoặc tài khoản Google.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
