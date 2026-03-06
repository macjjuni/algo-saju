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

const appName = process.env.NEXT_PUBLIC_APP_NAME || "알고사주";
const siteUrl = "https://www.algosaju.app";
const description =
  "AI 알고리즘으로 운세를 분석합니다. 연애운, 재물운, 건강운 등 다양한 운세를 하루 3회 무료로 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: appName, template: `%s - ${appName}` },
  description,
  keywords: [
    "사주",
    "운세",
    "AI 운세",
    "사주팔자",
    "연애운",
    "재물운",
    "궁합",
    "오늘의 운세",
    "무료 운세",
    "알고리즘 사주",
  ],
  openGraph: {
    type: "website",
    siteName: appName,
    title: `${appName} - AI 기반 사주 운세 분석`,
    description,
    url: siteUrl,
    locale: "ko_KR",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} - AI 기반 사주 운세 분석`,
    description,
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
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
