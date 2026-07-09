"use client";

import React, { useEffect, useState } from "react";
import { Info, BellRing, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [showFullpaper, setShowFullpaper] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
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
  }, []);

  if (!user) return <div className="p-8">Memuat beranda...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-entrance relative z-10">
      
      {/* Header / Welcome Banner - Glassmorphic on vibrant bg */}
      <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group hover:bg-white/15 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-yellow-300 font-bold mb-5 shadow-sm">
            Halo, Tim {user.teamName}!
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-400 pb-2">
            Selamat Datang di Dashboard
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl font-medium leading-relaxed drop-shadow-sm">
            Di sini Anda dapat mengelola tim, melihat pengumuman terbaru, dan mengumpulkan karya inovatif Anda.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute right-10 bottom-[-50px] w-40 h-40 bg-purple-400/30 rounded-full blur-[60px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pengumuman Terbaru */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-md flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.5)]"></span>
            Pengumuman Terbaru
          </h2>
          
          {showFinal ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:border-orange-400/50 hover:shadow-[0_30px_60px_rgba(251,146,60,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-orange-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300 mb-3 drop-shadow-sm pb-1">Selamat, Anda Masuk Final!</h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed mb-6">
                    Luar biasa! Tim Anda berhasil mencapai tahap akhir. Silakan kumpulkan file presentasi (PPT) Anda sebagai persiapan untuk Grand Final.
                  </p>
                  {user?.category !== "poster" && (
                    <Link href="/dashboard/ppt" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-base font-bold py-3.5 px-8 rounded-[1.2rem] shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
                      Kumpulkan PPT
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : showFullpaper ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:border-green-400/50 hover:shadow-[0_30px_60px_rgba(74,222,128,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-green-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300 mb-3 drop-shadow-sm pb-1">Selamat, Anda Lolos ke Tahap Berikutnya!</h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed mb-6">
                    Berdasarkan hasil penilaian Abstrak, tim Anda dinyatakan berhak untuk melanjutkan ke tahap Fullpaper. Silakan baca panduan penulisan dan kumpulkan sebelum tenggat waktu.
                  </p>
                  {user?.category !== "poster" && (
                    <Link href="/dashboard/fullpaper" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-base font-bold py-3.5 px-8 rounded-[1.2rem] shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
                      Kumpulkan Fullpaper
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-blue-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Clock size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 mb-2 drop-shadow-sm pb-1">Menunggu Pengumuman</h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">
                    Saat ini kami masih berada pada tahap pengumpulan karya atau penjurian. Pantau terus dashboard ini untuk informasi selanjutnya!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-purple-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Info size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 mb-2 drop-shadow-sm pb-1">Pendaftaran Berhasil Dikonfirmasi</h3>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  Bukti pembayaran Anda telah diverifikasi oleh panitia. Akun tim Anda kini sepenuhnya aktif.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Deadline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300 drop-shadow-md flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.5)]"></span>
            Tenggat Waktu
          </h2>
          
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-6 hover:bg-white/15 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-300">
            <div className="flex gap-5 items-center group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 text-orange-300 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-400 drop-shadow-sm">Pengumpulan Abstrak</p>
                <p className="text-sm text-orange-200 font-bold mt-1">21 Juli - 11 Agustus 2026</p>
              </div>
            </div>
            
            <div className="h-px bg-white/20 w-full my-6"></div>
            
            <div className="flex gap-5 items-center group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 text-green-300 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-400 drop-shadow-sm">Pengumpulan Fullpaper</p>
                <p className="text-sm text-green-200 font-bold mt-1">12 Agustus - 8 September 2026</p>
              </div>
            </div>

            <div className="h-px bg-white/20 w-full my-6"></div>
            
            <div className="flex gap-5 items-center group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 text-purple-300 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400 drop-shadow-sm">Pengumpulan PPT / Final</p>
                <p className="text-sm text-purple-200 font-bold mt-1">17 - 25 September 2026</p>
              </div>
            </div>
            
            <button 
              onClick={() => { 
                const current = localStorage.getItem("debug_time_bypass");
                if (!current || current === "0") {
                  localStorage.setItem("debug_time_bypass", "1"); // Fullpaper
                } else if (current === "1") {
                  localStorage.setItem("debug_time_bypass", "2"); // Final / PPT
                } else {
                  localStorage.setItem("debug_time_bypass", "0"); // Reset
                }
                window.location.reload(); 
              }}
              className="mt-6 text-[10px] font-black text-slate-300 hover:text-slate-500 w-full text-center py-3 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest"
            >
              [Toggle Bypass Waktu]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
