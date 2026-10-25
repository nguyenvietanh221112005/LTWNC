"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function credentialsSignIn(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // `signIn` thực hiện redirect bằng cách throw — lỗi đó KHÔNG phải AuthError
    // và phải được throw lại để Next.js xử lý điều hướng. Chỉ bắt lỗi xác thực.
    if (error instanceof AuthError) {
      return "Email hoặc mật khẩu không đúng.";
    }
    throw error;
  }
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" });
}
