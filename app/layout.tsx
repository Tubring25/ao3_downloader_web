import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Providers from "./providers";
import { cn } from "./lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AO3 Downloader",
  description: "Download and browse stories from Archive of Our Own",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "bg-[url('/images/home_bg.jpeg')] bg-cover bg-center bg-fixed min-h-screen text-foreground antialiased",
        )}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto page-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
