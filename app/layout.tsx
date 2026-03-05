import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import QueryProvider from "@/providers/query-provider";
import SessionProvider from "@/providers/session-provider";
import BackendAuthProvider from "@/providers/backend-auth-provider";
import { Header, Content, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "algo-saju",
  description: "algo-saju community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ko">
      <body className="antialiased">
        <SessionProvider session={session}>
          <QueryProvider>
            <BackendAuthProvider>
              <div className="flex min-h-svh flex-col">
                <Header />
                <Content>{children}</Content>
                <Footer />
              </div>
            </BackendAuthProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
