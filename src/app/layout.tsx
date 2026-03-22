import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { ConditionalMain } from "@/components/layout/conditional-main";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "@/components/ui/toast-container";
import { PageTransition } from "@/components/layout/page-transition";
import { constructMetadata, viewportDefaults } from "@/lib/seo";

const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-bai-jamjuree",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = constructMetadata({
  title: "Raycast - Canva Pro Membership",
  description: "แพลตฟอร์มสำหรับซื้อขาย Canva Pro ด้วยราคาที่เข้าถึงได้ ราคาประหยัด เปิดใช้งานทันที",
  keywords: ["Canva Pro", "Canva membership", " Canva subscription", "Canva ราคาถูก", "Canva premium"],
  canonical: "https://raycast.app",
});

export const viewport: Viewport = {
  ...viewportDefaults,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={baiJamjuree.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#0a0a0a]">
        <SessionProvider>
          <LenisProvider>
            <ConditionalNavbar />
            <ConditionalMain>
              <PageTransition>{children}</PageTransition>
            </ConditionalMain>
            <ConditionalFooter />
            <ToastContainer />
          </LenisProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
