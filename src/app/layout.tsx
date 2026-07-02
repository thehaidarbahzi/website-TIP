import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Innovation Paper 2026",
  description: "Pendaftaran Tech Innovation Paper 2026 oleh LPKTA dan Cendekia Teknika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-900 dark:text-slate-50">
        <div className="bg-animated-gradient"></div>
        <Navigation />
        <main className="flex-1 pt-16 md:pt-20 pb-20 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
