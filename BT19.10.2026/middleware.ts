import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Lớp bảo vệ #1: chặn SỚM trước khi route render. Chạy ở Edge Runtime nên
// chỉ dùng authConfig "nhẹ" (không bcrypt, không provider thật) — xem auth.config.ts.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
