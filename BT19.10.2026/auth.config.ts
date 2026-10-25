import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * Phần cấu hình "nhẹ", không chứa provider thật (Google secret, bcrypt...).
 * Dùng riêng cho Middleware vì Middleware chạy ở Edge Runtime, không có
 * đủ API của Node.js. Provider đầy đủ khai báo ở auth.ts.
 *
 * `jwt`/`session` callback đặt Ở ĐÂY (không phải auth.ts) vì Middleware
 * dựng một instance NextAuth RIÊNG (xem middleware.ts) — nếu không khai báo
 * chung ở authConfig, middleware sẽ không thấy được `role` trong token/
 * session và luôn coi auth.user.role là undefined.
 */
export const authConfig = {
  // Chạy tự host (next start trên localhost/VPS, không phải Vercel) nên
  // không có AUTH_URL cố định — tin tưởng header Host của request.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // Chỉ có `user` lúc đăng nhập (Google OAuth hoặc Credentials) — gắn
        // id/role vào token để dùng lại ở mọi request sau, không cần tra lại DB.
        token.id = user.id ?? token.sub ?? "";
        token.role = user.role ?? "user";
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

      if (isAdminRoute) {
        if (!isLoggedIn) return false; // -> redirect tới pages.signIn ("/login")
        if (auth.user.role !== "admin") {
          return Response.redirect(new URL("/403", nextUrl));
        }
        return true;
      }

      if (isDashboardRoute) {
        return isLoggedIn; // false -> redirect tới pages.signIn ("/login")
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
