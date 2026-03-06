import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import QueryProvider from "@/providers/query-provider";
import SessionProvider from "@/providers/session-provider";
import { Header, Content, Footer } from "@/components/layout";
import Starfield from "@/components/background/starfield";
import FortuneLoadingOverlay from "@/components/feature/fortune/loading-overlay";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "algo-saju";

export const metadata: Metadata = {
  title: { default: appName, template: `%s - ${appName}` },
  description: `${appName} community`,
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
        <GoogleAnalytics />
        <Starfield />
        <SessionProvider session={session}>
          <QueryProvider>
            <div className="flex min-h-dvh flex-col">
              <Header isAuthenticated={!!session} />
              <Content>{children}</Content>
              <Footer />
            </div>
            <FortuneLoadingOverlay />
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
