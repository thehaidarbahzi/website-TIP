"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import { SubmitSuccess } from "@/app/(utils)/components/ui/SubmitSuccess";
import { useSessionUser } from "@/app/(utils)/hooks/useSessionUser";

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

function concatUint8Arrays(chunks: Uint8Array[]) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

export default function AbstrakPage() {
  const user = useSessionUser();
  const [submitted, setSubmitted] = useState(false);
  const [subtema, setSubtema] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_CLIENT_ID = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "", []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (document.getElementById("google-identity-services")) return;

    const script = document.createElement("script");
    script.id = "google-identity-services";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const poll = setInterval(() => {
      const g = (window as any).google;
      if (!g?.accounts?.oauth2) return;
      clearInterval(poll);
      try {
        g.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/drive.file",
          callback: (resp: any) => setGoogleAccessToken(resp?.access_token || null),
        });
      } catch { /* ignore */ }
    }, 200);

    return () => clearInterval(poll);
  }, [GOOGLE_CLIENT_ID]);

  async function ensureDriveToken(): Promise<string> {
    if (googleAccessToken) return googleAccessToken;
    const g = (window as any).google;
    if (!g?.accounts?.oauth2) throw new Error("Google OAuth belum siap.");
    const tc = g.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (resp: any) => setGoogleAccessToken(resp?.access_token || null),
    });
    tc.requestAccessToken();
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (googleAccessToken) return resolve(googleAccessToken);
        if (Date.now() - start > 15000) return reject(new Error("Timeout Google OAuth"));
        requestAnimationFrame(check);
      };
      check();
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!user) { setError("Silakan login ulang."); return; }
    if (!subtema.trim() || !title.trim()) { setError("Subtema dan judul wajib diisi."); return; }
    if (!selectedFile) { setError("File abstrak wajib dipilih."); return; }
    if (selectedFile.type !== "application/pdf") { setError("Format file harus .pdf"); return; }
    if (selectedFile.size > 2 * 1024 * 1024) { setError("Ukuran file maksimal 2MB."); return; }

    setIsLoading(true);
    try {
      const accessToken = await ensureDriveToken();
      const folderId = process.env.NEXT_PUBLIC_DRIVE_ABSTRAK_FOLDER_ID;
      if (!folderId) throw new Error("Drive folder ID belum diset.");

      const boundary = `-------${crypto.randomUUID()}-------`;
      const metadata = { name: selectedFile.name, mimeType: "application/pdf", parents: [folderId] };

      const parts: Uint8Array[] = [];
      const enc = new TextEncoder();
      parts.push(enc.encode(`\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`));
      parts.push(enc.encode(`\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`));
      parts.push(new Uint8Array(await selectedFile.arrayBuffer()));
      parts.push(enc.encode(`\r\n--${boundary}--`));

      const uploadRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
          body: concatUint8Arrays(parts),
        },
      );

      if (!uploadRes.ok) throw new Error(`Drive upload gagal: ${uploadRes.status}`);

      const json = await uploadRes.json();
      const fileId = json?.id as string;
      const webViewLink = json?.webViewLink as string;
      const fileName = json?.name as string;
      if (!fileId) throw new Error("fileId tidak ditemukan setelah upload.");

      const { submitAbstrak } = await import("@/app/lib/action/abstrak");
      const result = await submitAbstrak({
        teamName: user.user_name,
        subtema,
        title,
        file: { fileName, fileSize: selectedFile.size, fileType: "application/pdf", fileId, webViewLink },
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

          <div className="pt-4">
            <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">
              Upload File Abstrak <span className="text-red-500">*</span>
            </label>
            <div className="border border-dashed border-white/30 bg-white/5 rounded-[1.5rem] p-10 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 text-white border border-white/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-bold text-white">Klik atau drag file ke sini</p>
              <p className="text-sm text-white/70 mt-2 font-medium">Maks. 2MB (Format: .pdf)</p>
              <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} required />
              {selectedFile && <p className="text-xs text-white/70 mt-3 font-medium">Dipilih: <span className="text-white/90">{selectedFile.name}</span></p>}
              {!googleAccessToken && <p className="text-xs text-white/70 mt-2 font-medium">Klik &ldquo;Kirim Abstrak&rdquo; untuk login Google Drive.</p>}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" fullWidth disabled={isLoading || !selectedFile}
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
