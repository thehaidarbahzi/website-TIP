"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";

export const Navigation = () => {
  const pathname = usePathname();
  const safePathname = pathname ?? "";

  // Hide navigation on landing page and login page
  if (safePathname === "/" || safePathname === "/login") {
    return null;
  }

  const navItems = [
    { label: "Beranda", href: "/dashboard", icon: Home },
    { label: "Pendaftaran", href: "/pendaftaran", icon: FileText },
    { label: "Profil", href: "/login", icon: User },
  ];

  return (
    <>
      {/* Top Navbar for Desktop */}
      <nav className="hidden md:flex w-[calc(100%-4rem)] max-w-5xl mx-auto h-16 bg-white/10 backdrop-blur-2xl border border-white/20 fixed top-6 left-0 right-0 z-50 items-center justify-between px-8 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-entrance">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_15px_rgba(252,211,77,0.5)]"></div>
          <span className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 drop-shadow-md">TxC <span className="text-yellow-300">2026</span></span>
        </Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              safePathname === item.href ||
              (item.href === "/dashboard" && safePathname.startsWith("/dashboard"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 text-yellow-300 font-bold shadow-inner border border-white/30" 
                    : "text-white/80 hover:bg-white/10 hover:text-white font-medium"
                }`}
              >
                <Icon size={18} className={isActive ? "drop-shadow-sm" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navbar for Mobile */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 z-50 flex items-center justify-around px-2 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-entrance">
        {navItems.map((item) => {
          const isActive =
            safePathname === item.href ||
            (item.href === "/dashboard" && safePathname.startsWith("/dashboard"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-white/20 text-white shadow-sm -translate-y-1" 
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              <Icon size={20} className={isActive ? "drop-shadow-sm" : ""} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
