import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "./lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // callbacks (jwt/session/authorized) đã khai báo trong authConfig — dùng
  // lại nguyên vẹn ở đây để Server Component/Route Handler và Middleware
  // luôn thấy cùng một logic gắn role vào phiên.
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = findUserByEmail(email);
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
