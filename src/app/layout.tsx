import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

// Korean display + body (the title & questions) — clean modern sans
const serifKr = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif-kr",
});

// Latin labels / numbers — techy grotesque
const serif = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

// Mono — spec captions / contact
const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ece9e2",
};

const SITE_DESC =
  "사이, 그리고 서로의 간격. 마주 앉은 두 사람을 위한 질문 카드 & 밸런스 카드 / Aida — a question & balance card game for two";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-question-cards.vercel.app"),
  title: "間 Aida — Question & Balance",
  description: SITE_DESC,
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aida",
  },
  openGraph: {
    title: "間 Aida — Question & Balance",
    description: SITE_DESC,
    type: "website",
    locale: "ko_KR",
    siteName: "Aida",
  },
  twitter: {
    card: "summary_large_image",
    title: "間 Aida — Question & Balance",
    description: SITE_DESC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${serifKr.variable} ${serif.variable} ${mono.variable} font-serif-kr`}>
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
