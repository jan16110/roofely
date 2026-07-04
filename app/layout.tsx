import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RoofBackground from "@/components/RoofBackground";
import BottomNav from "@/components/BottomNav";
import { ScanProvider } from "@/components/ScanStore";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roofely — AI Roof Scanner",
  description:
    "Scan your roof with AI. Spot problems, see repair costs, learn DIY fixes, and find pros.",
  applicationName: "Roofely",
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen overflow-hidden">
        {/* Morphing 3D roof — lives behind everything, reacts to every tap */}
        <RoofBackground />

        <ScanProvider>
          {/* Phone-sized stage, centered on larger screens */}
          <div className="relative z-10 mx-auto flex h-screen w-full max-w-md flex-col">
            <main className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-6">
              {children}
            </main>
            <BottomNav />
          </div>
        </ScanProvider>
      </body>
    </html>
  );
}
