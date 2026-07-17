"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import { SubmitSuccess } from "@/app/(utils)/components/ui/SubmitSuccess";
import { useSessionUser } from "@/app/(utils)/hooks/useSessionUser";
import { FileDropUpload } from "@/app/(utils)/components/ui/FileDropUpload";

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

export default function AbstrakPage() {
  const user = useSessionUser();
  const [submitted, setSubmitted] = useState(false);
  const [subtema, setSubtema] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<any>(null);
  const [biodata, setBiodata] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!user) { setError("Silakan login ulang."); return; }
    if (!subtema.trim() || !title.trim()) { setError("Subtema dan judul wajib diisi."); return; }
    if (!file) { setError("File abstrak wajib dipilih."); return; }
    if (!biodata) { setError("File biodata wajib dipilih."); return; }

    setIsLoading(true);
    try {
      const { submitAbstrak } = await import("@/app/lib/action/abstrak");
      const result = await submitAbstrak({
        teamName: user.user_name,
        subtema,
        title,
        file,
        biodata,
      });
      if (!result.ok) throw new Error(result.error || "Gagal menyimpan abstrak.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim abstrak.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return <div className="p-8">Memuat halaman...</div>;
  const categories = user.category as "lkti" | "essay";
  const themesList = THEMES[categories] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Pengumpulan Abstrak
        </h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          <div className="bg-blue-500/20 text-blue-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-blue-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            Halo <strong className="text-white">{user.user_name}</strong>!
            Pastikan file abstrak Anda berformat <strong className="text-white">.pdf</strong> dan ukurannya tidak melebihi <strong className="text-white">2MB</strong>.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-white drop-shadow-sm">
              Pilih Subtema <span className="text-red-500">*</span>
            </label>
            <select
              className="flex h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer [&>option]:text-slate-900"
              required
              value={subtema}
              onChange={(e) => setSubtema(e.target.value)}
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <Input label="Judul Karya Abstrak" placeholder="Masukkan judul abstrak secara lengkap" variant="glass" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileDropUpload label="Upload Biodata" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setBiodata} />
            <FileDropUpload label="Upload File Abstrak" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setFile} />
          </div>

          {error && <p className="text-sm text-red-400 font-bold">{error}</p>}

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" fullWidth disabled={isLoading || !file || !biodata}
              className="bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {isLoading ? "Mengirim..." : "Kirim Abstrak"}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <SubmitSuccess title="Abstrak Berhasil Terkirim!">
            Terima kasih telah mengumpulkan abstrak. Pengumuman lolos ke tahap selanjutnya akan diinformasikan pada menu Beranda tanggal 30 September 2026.
          </SubmitSuccess>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setSubmitted(false)}
              className="border border-white/40 bg-white/10 text-white font-bold hover:bg-white/20 hover:text-white px-8 py-3 rounded-xl backdrop-blur-md transition-all shadow-sm"
            >
              Kirim Ulang / Perbarui Abstrak
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
