"use client";

import React, { useEffect, useState } from "react";
import { FilePlus, UploadCloud, CheckCircle, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const THEMES = {
  lkti: [
    "Industri Manufaktur, Otomasi, dan IoT",
    "Infrastruktur, Geospasial, dan Mitigasi Bencana",
    "Energi Terbarukan dan Teknologi Lingkungan",
    "Agraria, Teknologi Pangan, dan Bioteknologi",
    "Teknologi Medis dan Alat Kesehatan",
    "Teknologi Edukasi dan Media Pembelajaran"
  ],
  essay: [
    "Agraria dan Pangan: Rekayasa Inovasi Teknologi Terapan",
    "Energi dan Lingkungan: Pemberdayaan Energi Bersih",
    "Publik dan Kesehatan: Optimalisasi Tingkat Komponen",
    "Pendidikan dan SDM: Inovasi Teknologi",
    "Mitigasi Bencana dan Geospasial: Pengembangan Teknologi Cerdas"
  ]
};

export default function FullpaperPage() {
  const [user, setUser] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }

    const debugLevel = localStorage.getItem("debug_time_bypass");
    const now = new Date();
    // Fullpaper Timeline: 12 Aug - 8 Sept 2026
    const start = new Date("2026-08-12T00:00:00");
    const end = new Date("2026-09-08T23:59:59");
    
    if (debugLevel !== "1" && debugLevel !== "2" && (now < start || now > end)) {
      setIsLocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user) return <div className="p-8">Memuat halaman...</div>;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-entrance relative z-10">
        <div className="w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner rotate-3">
          <Lock size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 mb-4 drop-shadow-md pb-1">Pengumpulan Fullpaper Dikunci</h1>
        <p className="text-white/80 max-w-lg text-lg leading-relaxed font-medium drop-shadow-sm">
          Pengumpulan Fullpaper hanya dapat dilakukan setelah pengumuman Abstrak (mulai <strong className="text-white">12 Agustus - 8 September 2026</strong>).
        </p>
      </div>
    );
  }

  const userCategory = user.category as "lkti" | "essay";
  const themesList = THEMES[userCategory] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <FilePlus className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">Pengumpulan Fullpaper</h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          
          <div className="bg-yellow-500/20 text-yellow-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-yellow-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            <strong className="text-white">Perhatian {user.teamName}:</strong> Pastikan Anda telah dinyatakan <strong className="text-white">Lolos</strong> sebelum mengumpulkan fullpaper.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-white drop-shadow-sm">Pilih Subtema <span className="text-red-500">*</span></label>
            <select 
              className="flex h-12 w-full rounded-[0.8rem] border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer [&>option]:text-slate-900"
              required
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((theme, idx) => (
                <option key={idx} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Fullpaper" placeholder="Masukkan judul akhir fullpaper Anda" variant="glass" required />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">Upload Lembar Orisinalitas <span className="text-red-500">*</span></label>
              <div className="border border-dashed border-white/30 bg-white/5 rounded-[1.2rem] p-8 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm">
                <div className="w-14 h-14 bg-white/20 text-white border border-white/30 rounded-[1rem] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <UploadCloud size={28} />
                </div>
                <p className="text-sm font-bold text-white">Lembar Orisinalitas</p>
                <p className="text-xs text-white/70 mt-1">Maks. 2MB (.pdf)</p>
                <input type="file" className="hidden" accept=".pdf" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">Upload Fullpaper <span className="text-red-500">*</span></label>
              <div className="border border-dashed border-white/30 bg-white/5 rounded-[1.2rem] p-8 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm">
                <div className="w-14 h-14 bg-white/20 text-white border border-white/30 rounded-[1rem] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <UploadCloud size={28} />
                </div>
                <p className="text-sm font-bold text-white">File Fullpaper</p>
                <p className="text-xs text-white/70 mt-1">Maks. 10MB (.pdf)</p>
                <input type="file" className="hidden" accept=".pdf" required />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" className="w-full bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300">
              Kirim Fullpaper
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 text-white border-2 border-white/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner backdrop-blur-md">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4 drop-shadow-md pb-1">Fullpaper Berhasil Terkirim!</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto text-lg leading-relaxed font-medium">
              Terima kasih, karya Anda sudah tersimpan di sistem kami. Semoga beruntung di tahap Grand Final!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
