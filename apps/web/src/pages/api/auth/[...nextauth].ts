// apps/web/src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserProfile from "@/models/pii/UserProfile";
import { verifyTotp } from "@features/utils/totp"; // deine TOTP-Verify-Funktion
import dbConnect from "@/src/lib/db";

export default NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12h
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {}, totp: {} },
      async authorize(credentials) {
        await dbConnect();
        const user = await UserProfile.findOne({ email: credentials?.email }).select("+mfaSecret");
        if (!user) throw new Error("Invalid credentials");
        const ok = await bcrypt.compare(credentials!.password, (user as any).passwordHash);
        if (!ok) throw new Error("Invalid credentials");

        if (user.mfaEnabled) {
          const totpOk = verifyTotp(credentials!.totp, user.getDecryptedMfaSecret());
          if (!totpOk) throw new Error("Invalid MFA code");
        }
        // nur minimale, erlaubte Daten
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          roles: user.roles,
          verification: user.verification,
          premium: user.premium,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.username = (user as any).username;
        token.roles = (user as any).roles;
        token.verification = (user as any).verification;
        token.premium = (user as any).premium;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.uid as string,
        username: token.username as string,
        roles: (token.roles as any[]) || [],
        verification: (token.verification as string) || "none",
        premium: !!token.premium,
        email: (session.user?.email as string) || "",
      } as any;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
