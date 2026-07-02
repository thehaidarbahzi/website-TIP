"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";

export const Navigation = () => {
  const pathname = usePathname();

  // Hide navigation on landing page and login page
  if (pathname === "/" || pathname === "/login") {
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
      <nav className="hidden md:flex w-full h-16 glass fixed top-0 left-0 z-50 items-center justify-between px-8 animate-entrance">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-brand"></div>
          <span className="font-bold text-lg text-gradient">TIP 2026</span>
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-brand-purple)] ${
                  isActive ? "text-[var(--color-brand-purple)]" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navbar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 glass z-50 flex items-center justify-around px-4 pb-safe animate-entrance">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive ? "text-[var(--color-brand-purple)]" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon size={20} className={isActive ? "fill-current opacity-20" : ""} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
