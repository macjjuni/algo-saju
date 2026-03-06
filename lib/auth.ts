import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const backendTokenCache = new Map<string, string>();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account }) {
      if (!account?.id_token) return true;

      try {
        const res = await fetch(`${API_URL}/api/v1/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: account.id_token }),
        });

        if (res.status === 403) {
          const data = await res.json();
          const params = new URLSearchParams({
            error: "withdrawn",
            message: data.message,
            retryAfter: data.retryAfter,
          });
          return `/login?${params.toString()}`;
        }

        if (res.ok) {
          const data = await res.json();
          backendTokenCache.set(account.id_token, data.accessToken);
        }
      } catch {
        // 백엔드 인증 실패 시 무시
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;

        const cached = backendTokenCache.get(account.id_token);
        if (cached) {
          token.backendToken = cached;
          backendTokenCache.delete(account.id_token);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      session.backendToken = token.backendToken as string | undefined;
      return session;
    },
  },
});
