import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutClient from "./LayoutClient";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
