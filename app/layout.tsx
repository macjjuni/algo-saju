import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import QueryProvider from "@/providers/query-provider";
import SessionProvider from "@/providers/session-provider";
import { Header, Content, Footer } from "@/components/layout";
import Starfield from "@/components/background/starfield";
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
      <body className="antialiased bg-black text-white">
        <Starfield />
        <SessionProvider session={session}>
          <QueryProvider>
            <div className="flex min-h-dvh flex-col">
              <Header isAuthenticated={!!session} />
              <Content>{children}</Content>
              <Footer />
            </div>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
