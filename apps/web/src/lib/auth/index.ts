// apps/web/src/lib/auth/index.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// triMongo: wir lesen Nutzer aus der PII-DB (kein Mongoose)
import { piiCol } from "@core/triMongo";

// Optional: Deine bestehende TOTP-Verify-Funktion
let verifyTotp: ((code?: string, secret?: string) => boolean) | null = null;
try {
  // falls vorhanden (bei dir: @features/utils/totp)
  // Signatur soll true/false liefern
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  verifyTotp = require("@features/utils/totp").verifyTotp ?? null;
} catch {
  verifyTotp = null; // totp optional
}

type PiiUser = {
  _id: any;
  email: string;
  username?: string;
  roles?: string[];
  verification?: string;
  premium?: boolean;
  passwordHash?: string;
  mfaEnabled?: boolean;
  // beliebiger Name für dein verschlüsseltes Secret-Feld:
  mfaSecretEncrypted?: string; 
  // oder plain text, wenn du das bereits entschlüsselst (nicht empfohlen):
  mfaSecretPlain?: string;
};

async function getUserByEmail(email: string) {
  const col = await piiCol<PiiUser>("user_profiles");
  const user = await col.findOne(
    { email: email.toLowerCase() },
    {
      projection: {
        _id: 1, email: 1, username: 1, roles: 1, verification: 1, premium: 1,
        passwordHash: 1, mfaEnabled: 1, mfaSecretEncrypted: 1, mfaSecretPlain: 1,
      },
    }
  );
  return user || null;
}

/** Falls du eine Entschlüsselung brauchst – hier einklinken (sonst plaintext verwenden). */
function getDecryptedMfaSecret(u: PiiUser): string | undefined {
  if (u.mfaSecretPlain) return u.mfaSecretPlain;
  // TODO: hier deine Entschlüsselung einfügen, wenn mfaSecretEncrypted benutzt wird.
  // z.B. decrypt(u.mfaSecretEncrypted, process.env.MFA_KEY)
  return undefined;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12h
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // **Keine** OAuth-Provider – nur Credentials
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
        totp: { label: "TOTP", type: "text", placeholder: "123 456", optional: true as any },
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().trim().toLowerCase();
        const password = (creds?.password || "").toString();
        const totp = (creds?.totp || "").toString().replace(/\s+/g, "");

        if (!email || !password) throw new Error("Missing credentials");

        const user = await getUserByEmail(email);
        if (!user?.passwordHash) throw new Error("Invalid credentials");

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new Error("Invalid credentials");

        if (user.mfaEnabled) {
          if (!verifyTotp) throw new Error("MFA required but TOTP not configured");
          const secret = getDecryptedMfaSecret(user);
          if (!secret || !verifyTotp(totp, secret)) throw new Error("Invalid MFA code");
        }

        // Nur minimal erlaubte Daten in 'user' zurückgeben – Rest kommt via JWT-Callback
        return {
          id: String(user._id),
          username: user.username,
          email: user.email,
          roles: user.roles || [],
          verification: user.verification || "none",
          premium: !!user.premium,
        } as any;
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
      (session.user as any) = {
        ...(session.user || {}),
        id: (token as any).uid ?? token.sub ?? null,
        username: (token as any).username ?? null,
        roles: (token as any).roles || [],
        verification: (token as any).verification || "none",
        premium: !!(token as any).premium,
        email: session.user?.email || null,
      };
      return session;
    },
  },

  pages: { signIn: "/login" },
};

export default authOptions;

/* ---------- (optional) TS-Augmentation für bessere Types ---------- */
declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
      username?: string | null;
      email?: string | null;
      roles?: string[];
      verification?: string;
      premium?: boolean;
      image?: string | null;
      name?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    username?: string;
    roles?: string[];
    verification?: string;
    premium?: boolean;
  }
}
