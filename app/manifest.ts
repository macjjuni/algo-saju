import type { MetadataRoute } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "알고사주";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${appName} - AI 기반 사주 운세 분석`,
    short_name: appName,
    description:
      "AI 알고리즘으로 운세를 분석합니다. 연애운, 재물운, 건강운 등 다양한 운세를 하루 3회 무료로 확인하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
