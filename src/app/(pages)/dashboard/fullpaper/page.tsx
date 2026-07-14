"use client";

import { useState } from "react";
import { FilePlus } from "lucide-react";
import { useSessionUser } from "@/app/(utils)/hooks/useSessionUser";
import { useTimeLock } from "@/app/(utils)/hooks/useTimeLock";
import { Warnscreen } from "@/app/(utils)/components/ui/Warnscreen";
import { SubmitSuccess } from "@/app/(utils)/components/ui/SubmitSuccess";
import { FileDropUpload } from "@/app/(utils)/components/ui/FileDropUpload";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";

const THEMES: Record<string, string[]> = {
  lkti: [
    "Industri Manufaktur, Otomasi, dan IoT",
    "Infrastruktur, Geospasial, dan Mitigasi Bencana",
    "Energi Terbarukan dan Teknologi Lingkungan",
    "Agraria, Teknologi Pangan, dan Bioteknologi",
    "Teknologi Medis dan Alat Kesehatan",
    "Teknologi Edukasi dan Media Pembelajaran",
  ],
  essay: [
    "Agraria dan Pangan: Rekayasa Inovasi Teknologi Terapan",
    "Energi dan Lingkungan: Pemberdayaan Energi Bersih",
    "Publik dan Kesehatan: Optimalisasi Tingkat Komponen",
    "Pendidikan dan SDM: Inovasi Teknologi",
    "Mitigasi Bencana dan Geospasial: Pengembangan Teknologi Cerdas",
  ],
};

export default function FullpaperPage() {
  const user = useSessionUser();
  const { isLocked, lockMessage } = useTimeLock(
    user?.category || "lkti",
    "pengumpulan_fullpaper",
  );

  const [submitted, setSubmitted] = useState(false);
  const [subtema, setSubtema] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<any>(null);
  const [orisinalitas, setOrisinalitas] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-8">Memuat halaman...</div>;
  if (isLocked) {
    return (
      <Warnscreen title="Pengumpulan Fullpaper Dikunci">
        {lockMessage}
      </Warnscreen>
    );
  }

  const themesList = THEMES[user.category] || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const { submitFullpaper } = await import("@/app/lib/action/submissions");
      const res = await submitFullpaper({
        teamName: user.user_name,
        subtema,
        title,
        file,
        orisinalitas,
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <FilePlus className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Pengumpulan Fullpaper
        </h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          <div className="bg-yellow-500/20 text-yellow-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-yellow-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            <strong className="text-white">Perhatian {user.user_name}:</strong>{" "}
            Pastikan Anda telah dinyatakan <strong className="text-white">Lolos</strong> sebelum mengumpulkan fullpaper.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-white drop-shadow-sm">
              Pilih Subtema <span className="text-red-500">*</span>
            </label>
            <select
              className="flex h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer [&>option]:text-slate-900"
              required
              value={subtema}
              onChange={(e) => setSubtema(e.target.value)}
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Fullpaper" placeholder="Masukkan judul akhir fullpaper Anda" variant="glass" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileDropUpload label="Upload Lembar Orisinalitas" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setOrisinalitas} />
            <FileDropUpload label="Upload Fullpaper" accept=".pdf" maxSizeMB={10} teamName={user.user_name} stage="penyisihan" onUpload={setFile} />
          </div>

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" fullWidth disabled={loading || !file}
              className="bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {loading ? "Mengirim..." : "Kirim Fullpaper"}
            </Button>
          </div>
        </form>
      ) : (
        <SubmitSuccess title="Fullpaper Berhasil Terkirim!">
          Terima kasih, karya Anda sudah tersimpan di sistem kami. Semoga beruntung di tahap Grand Final!
        </SubmitSuccess>
      )}
    </div>
  );
}
