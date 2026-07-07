"use client";

import { Navigation } from "@/components/layout/Navigation";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasNav = pathname !== "/" && pathname !== "/login";

  return (
    <>
      <Navigation />
      <main className={`flex-1 ${hasNav ? "pt-16 md:pt-20" : ""} pb-20 md:pb-8`}>
        {children}
      </main>
    </>
  );
}
