"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, FileText, Image as ImageIcon, FilePlus, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [showFullpaper, setShowFullpaper] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (!session) {
      console.warn("Session is missing!");
      router.push("/login");
    } else {
      setUser(JSON.parse(session));
    }
    
    // Check timeline for fullpaper and PPT
    const debugLevel = localStorage.getItem("debug_time_bypass");
    const now = new Date();
    const abstrakAnnounceDate = new Date("2026-08-12T00:00:00");
    const fullpaperAnnounceDate = new Date("2026-09-17T00:00:00");

    let isFullpaper = now >= abstrakAnnounceDate;
    let isFinal = now >= fullpaperAnnounceDate;

    if (debugLevel === "1") {
      isFullpaper = true;
      isFinal = false;
    } else if (debugLevel === "2") {
      isFullpaper = true;
      isFinal = true;
    }

    setShowFullpaper(isFullpaper);
    setShowFinal(isFinal);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("tip_current_user");
    router.push("/login");
  };

  // DO NOT early return without children in a Next.js Layout! It aborts routing!
  const isKTI = user ? (user.category === "lkti" || user.category === "essay") : false;
  const isPoster = user ? (user.category === "poster") : false;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--color-brand-purple)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat sesi Dashboard...</p>
          <div className="hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex animate-entrance relative">

      {/* Sidebar (Desktop) - True Glassmorphic */}
      <div className="hidden md:flex w-64 bg-white/10 backdrop-blur-3xl border-r border-white/20 flex-col h-full relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        <div className="p-8 pb-4 text-center relative z-10 border-b border-white/10">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black shadow-[0_10px_20px_rgba(252,211,77,0.3)] border border-yellow-200/50">
            {user?.teamName?.[0]?.toUpperCase() || "T"}
          </div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 drop-shadow-md pb-1">{user?.teamName || "Nama Tim"}</h2>
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 mt-1 rounded-full border border-white/30 backdrop-blur-sm tracking-wider uppercase">Dashboard</span>
        </div>
        
        <nav className="flex-1 p-5 space-y-2.5 overflow-y-auto">
          <Link href="/dashboard" className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-[1.2rem] font-bold ${isActive("/dashboard") ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <Home size={22} />
            Beranda
          </Link>
          <Link href="/dashboard/team" className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-[1.2rem] font-bold ${isActive("/dashboard/team") ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <Users size={22} />
            My Team
          </Link>
          
          <div className="pt-8 pb-3 relative">
            <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <p className="relative z-10 bg-transparent inline-block px-3 text-[10px] font-black text-white/50 uppercase tracking-widest mx-2 backdrop-blur-sm rounded-full">Pengumpulan Karya</p>
          </div>
          
          {isKTI && (
            <>
              <Link href="/dashboard/abstrak" className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-[1.2rem] font-bold ${isActive("/dashboard/abstrak") ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <FileText size={22} />
                Abstrak
              </Link>
              {showFullpaper && (
                <Link href="/dashboard/fullpaper" className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-[1.2rem] font-bold ${isActive("/dashboard/fullpaper") ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <FilePlus size={22} />
                  Fullpaper
                </Link>
              )}
              {showFinal && (
                <Link href="/dashboard/ppt" className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-[1.2rem] font-bold ${isActive("/dashboard/ppt") ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <ImageIcon size={22} />
                  PPT
                </Link>
              )}
            </>
          )}

          {isPoster && (
            <Link href="/dashboard/poster" className="flex items-center gap-4 px-5 py-3.5 text-white/70 hover:bg-white/10 hover:text-white hover:-translate-y-1 rounded-[1.2rem] font-bold transition-all duration-300 shadow-sm">
              <ImageIcon size={22} className="text-white/70" />
              Poster
            </Link>
          )}
        </nav>

        <div className="p-5 border-t border-white/10 bg-black/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/10 text-white/90 hover:bg-red-500/80 hover:text-white hover:-translate-y-1 rounded-[1.2rem] font-bold transition-all duration-300 shadow-sm backdrop-blur-md">
            <LogOut size={22} />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative z-10 pt-24 md:pt-28 pb-12">
        
        {/* Mobile Header (Glassmorphic) */}
        <header className="md:hidden bg-white/10 backdrop-blur-xl border-b border-white/20 p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner border border-white/30">
              T
            </div>
            <span className="font-extrabold text-xl text-white drop-shadow-md">TxC 2026</span>
          </div>
          <button onClick={handleLogout} className="text-white/90 text-sm font-bold bg-white/20 px-4 py-2 rounded-full shadow-sm backdrop-blur-md border border-white/20">Keluar</button>
        </header>
        
        <div className="p-6 md:p-10 flex-1 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
