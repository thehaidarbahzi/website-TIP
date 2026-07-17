"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Image as ImageIcon,
  FilePlus,
  LogOut,
  Shield,
  CheckSquare,
  Star,
  ClipboardList,
  UserCog,
} from "lucide-react";
import { logoutUser } from "@/app/lib/action/auth";
import { useEventTimeline } from "@/app/(utils)/hooks/useEventTimeline";

type UserData = {
  user_id: string;
  user_name: string;
  user_role: string;
  category?: string;
  team_status?: string;
};

function isActive(pathname: string, target: string) {
  if (target === "/dashboard") return pathname === "/dashboard";
  return pathname === target || pathname.startsWith(target + "/");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bypass, setBypass] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { timeline } = useEventTimeline();

  const category = user?.category || "lkti";
  const cat = timeline?.[category as keyof typeof timeline];

  const now = Date.now();
  function hasTimePassed(time?: number, stageVal?: string): boolean {
    if (bypass) {
      if (bypass === "2") return true;
      if (bypass === "1" && stageVal === "1") return true;
      return false;
    }
    if (!time) return false;
    return now >= time;
  }

  const abstrakAnnounce = cat?.pengumuman_abstrak?.time;
  const fullpaperAnnounce = cat?.pengumuman_fullpaper?.time;
  const isFullpaper = hasTimePassed(abstrakAnnounce, "1");
  const isFinal = hasTimePassed(fullpaperAnnounce, "2");

  useEffect(() => {
    setBypass(localStorage.getItem("debug_time_bypass"));
  }, []);

  const handleBypass = (val: string | null) => {
    if (val) {
      localStorage.setItem("debug_time_bypass", val);
    } else {
      localStorage.removeItem("debug_time_bypass");
    }
    setBypass(val);
    window.location.reload();
  };

  useEffect(() => {
    async function load() {
      try {
        const { getCurrentUser } = await import("@/app/lib/action/auth");
        const session = await getCurrentUser();
        if (!session) {
          router.push("/login");
          return;
        }
        setUser(session);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const role = user?.user_role;

  useEffect(() => {
    if (!role) return;
    // All roles use /dashboard — no role-based redirects needed
  }, [role, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isGuest = user.user_role === "guest";
  const isAdmin = user.user_role === "admin";
  const isJuri = user.user_role === "juri";

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white/10 backdrop-blur-3xl border-r border-white/20 flex-col h-screen sticky top-0 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="p-8 pb-4 text-center relative z-10 border-b border-white/10">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black shadow-[0_10px_20px_rgba(252,211,77,0.3)] border border-yellow-200/50">
            {user.user_name?.[0]?.toUpperCase() || "T"}
          </div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 drop-shadow-md pb-1">
            {user.user_name || "User"}
          </h2>
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 mt-1 rounded-full border border-white/30 backdrop-blur-sm tracking-wider uppercase">
            {isGuest ? "Peserta" : user.user_role}
          </span>
        </div>

        <nav className="flex-1 p-5 space-y-2.5 overflow-y-auto">
          {/* Guest nav */}
          {isGuest && (
            <>
              <NavLink
                href="/dashboard"
                pathname={pathname}
                icon={<Home size={22} />}
                label="Beranda"
              />
              <NavLink
                href="/dashboard/team"
                pathname={pathname}
                icon={<Users size={22} />}
                label="My Team"
              />
              <div className="pt-8 pb-3 relative">
                <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="relative z-10 bg-transparent inline-block px-3 text-[10px] font-black text-white/50 uppercase tracking-widest mx-2 backdrop-blur-sm rounded-full">
                  Pengumpulan Karya
                </p>
              </div>
              {(user.category === "lkti" || user.category === "essay") && user.team_status !== "rejected" && (
                <>
                  <NavLink
                    href="/dashboard/abstrak"
                    pathname={pathname}
                    icon={<FileText size={22} />}
                    label="Abstrak"
                    subtitle={(isFullpaper || isFinal) ? "Lolos / Disubmit" : undefined}
                    disabled={isFullpaper || isFinal}
                  />
                  {(isFullpaper || isFinal) && (
                    <NavLink
                      href="/dashboard/fullpaper"
                      pathname={pathname}
                      icon={<FilePlus size={22} />}
                      label="Fullpaper"
                      subtitle={isFinal ? "Lolos / Disubmit" : undefined}
                      disabled={isFinal}
                    />
                  )}
                  {isFinal && (
                    <NavLink
                      href="/dashboard/ppt"
                      pathname={pathname}
                      icon={<FilePlus size={22} />}
                      label="PPT"
                    />
                  )}
                </>
              )}
              {user.category === "poster" && user.team_status !== "rejected" && (
                <NavLink
                  href="/dashboard/poster"
                  pathname={pathname}
                  icon={<ImageIcon size={22} />}
                  label="Poster"
                />
              )}
              {/* Debug Time Bypass in Sidebar */}
              <div className="pt-8 pb-3 relative">
                <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="relative z-10 bg-transparent inline-block px-3 text-[10px] font-black text-white/50 uppercase tracking-widest mx-2 backdrop-blur-sm rounded-full">
                  Debug Waktu
                </p>
              </div>
              <div className="px-2">
                <select
                  value={bypass || ""}
                  onChange={(e) => handleBypass(e.target.value || null)}
                  className="w-full bg-white/10 text-white/70 text-xs font-bold rounded-lg p-2 border border-white/20 outline-none focus:border-white/40 appearance-none cursor-pointer"
                >
                  <option value="" className="text-black">Normal</option>
                  <option value="1" className="text-black">Tahap 2 (Fullpaper)</option>
                  <option value="2" className="text-black">Tahap 3 (Final/PPT)</option>
                </select>
              </div>
            </>
          )}

          {/* Admin nav */}
          {isAdmin && (
            <>
              <NavLink
                href="/dashboard"
                pathname={pathname}
                icon={<Shield size={22} />}
                label="Overview"
              />
              <div className="pt-8 pb-3 relative">
                <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="relative z-10 bg-transparent inline-block px-3 text-[10px] font-black text-white/50 uppercase tracking-widest mx-2 backdrop-blur-sm rounded-full">
                  Management
                </p>
              </div>
              <NavLink
                href="/dashboard/teams"
                pathname={pathname}
                icon={<Users size={22} />}
                label="Teams"
              />
              <NavLink
                href="/dashboard/verifikasi"
                pathname={pathname}
                icon={<CheckSquare size={22} />}
                label="Verifikasi"
              />
              <NavLink
                href="/dashboard/users"
                pathname={pathname}
                icon={<UserCog size={22} />}
                label="Users"
              />
            </>
          )}

          {/* Juri nav */}
          {isJuri && (
            <>
              <NavLink
                href="/dashboard"
                pathname={pathname}
                icon={<ClipboardList size={22} />}
                label="Overview"
              />
              <div className="pt-8 pb-3 relative">
                <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="relative z-10 bg-transparent inline-block px-3 text-[10px] font-black text-white/50 uppercase tracking-widest mx-2 backdrop-blur-sm rounded-full">
                  Penilaian
                </p>
              </div>
              <NavLink
                href="/dashboard/submissions"
                pathname={pathname}
                icon={<FileText size={22} />}
                label="Submissions"
              />
              <NavLink
                href="/dashboard/score"
                pathname={pathname}
                icon={<Star size={22} />}
                label="Beri Nilai"
              />
            </>
          )}
        </nav>

        <div className="p-5 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/10 text-white/90 hover:bg-red-500/80 hover:text-white hover:-translate-y-1 rounded-[1.2rem] font-bold transition-all duration-300 shadow-sm backdrop-blur-md"
          >
            <LogOut size={22} />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/10 backdrop-blur-xl border-b border-white/20 p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner border border-white/30">
              {user.user_name?.[0]?.toUpperCase() || "T"}
            </div>
            <span className="font-extrabold text-xl text-white drop-shadow-md">
              TxC 2026
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/90 text-sm font-bold bg-white/20 px-4 py-2 rounded-full shadow-sm backdrop-blur-md border border-white/20"
          >
            Keluar
          </button>
        </header>

        <div className="p-6 md:p-10 flex-1 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  pathname,
  icon,
  label,
  subtitle,
  disabled,
}: {
  href: string;
  pathname: string;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  disabled?: boolean;
}) {
  const active = isActive(pathname, href) && !disabled;
  return (
    <Link
      href={disabled ? "#" : href}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
      className={`flex items-center gap-4 px-5 py-3 transition-all duration-300 rounded-[1.2rem] font-bold ${
        disabled
          ? "bg-white/5 border border-white/10 text-white/50 cursor-default"
          : active
          ? "bg-gradient-to-r from-white/20 to-white/10 text-yellow-300 border border-white/30 shadow-inner"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <div className={disabled ? "opacity-60" : ""}>{icon}</div>
      <div className="flex flex-col">
        <span className={disabled ? "opacity-80" : ""}>{label}</span>
        {subtitle && (
          <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}
