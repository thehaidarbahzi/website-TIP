"use client";

import { useState } from "react";
import { Presentation } from "lucide-react";
import { useSessionUser } from "@/app/(utils)/hooks/useSessionUser";
import { useTimeLock } from "@/app/(utils)/hooks/useTimeLock";
import { Warnscreen } from "@/app/(utils)/components/ui/Warnscreen";
import { SubmitSuccess } from "@/app/(utils)/components/ui/SubmitSuccess";
import { FileDropUpload } from "@/app/(utils)/components/ui/FileDropUpload";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";

export default function PPTPage() {
  const user = useSessionUser();
  const { isLocked, lockMessage } = useTimeLock(
    user?.category || "lkti",
    "final",
  );

  const [submitted, setSubmitted] = useState(false);
  const [link, setLink] = useState("");
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-8">Memuat halaman...</div>;
  if (isLocked) {
    return (
      <Warnscreen title="Pengumpulan PPT Dikunci">
        {lockMessage}
      </Warnscreen>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link && !file) return;
    setLoading(true);
    try {
      const { submitPPT } = await import("@/app/lib/action/submissions");
      const res = await submitPPT({
        teamName: user.user_name,
        link: link || undefined,
        file: file || undefined,
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <Presentation className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Pengumpulan PPT (Final)
        </h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          <div className="bg-yellow-500/20 text-yellow-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-yellow-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            <strong className="text-white">Perhatian {user.user_name}:</strong>{" "}
            Selamat Anda berhasil masuk ke tahap Final! Silakan kumpulkan file presentasi (PPT) Anda.
          </div>

          <Input label="Tautan PPT (Google Drive dsb)" placeholder="Masukkan link PPT yang dapat diakses publik" variant="glass" value={link} onChange={(e) => setLink(e.target.value)} />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileDropUpload label="Atau Upload File PPT" accept=".pptx,.pdf" maxSizeMB={20} teamName={user.user_name} stage="final" onUpload={setFile} />
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" fullWidth disabled={loading || (!link && !file)}
              className="bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {loading ? "Mengirim..." : "Kirim Presentasi"}
            </Button>
          </div>
        </form>
      ) : (
        <SubmitSuccess title="PPT Berhasil Terkirim!">
          Terima kasih, file presentasi Anda sudah tersimpan. Persiapkan diri Anda untuk Grand Final!
        </SubmitSuccess>
      )}
    </div>
  );
}
