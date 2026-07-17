"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import {
  Check,
  ChevronRight,
  FileImage,
  CreditCard,
  Lock,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useEventTimeline } from "@/app/(utils)/hooks/useEventTimeline";

function formatMs(ms: number): string {
  const d = new Date(ms);
  const day = d.getDate();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [lockDates, setLockDates] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { timeline } = useEventTimeline();

  const [formData, setFormData] = useState({
    category: "",
    teamName: "",
    institution: "",
    leaderName: "",
    leaderNim: "",
    leaderWa: "",
    leaderEmail: "",
    leaderPassword: "",
    member1Name: "",
    member1Nim: "",
    member1Wa: "",
    member1Email: "",
    member2Name: "",
    member2Nim: "",
    member2Wa: "",
    member2Email: "",
  });

  useEffect(() => {
    if (!timeline) return;
    const bypass = localStorage.getItem("debug_time_bypass");
    if (bypass === "true") {
      setIsTimeLocked(false);
      return;
    }

    const allCats = ["lkti", "essay", "poster"] as const;
    let locked = false;
    let dateStr = "";

    for (const cat of allCats) {
      const pendaftaran = timeline[cat]?.pendaftaran;
      if (!pendaftaran) {
        locked = true;
        continue;
      }
      const now = Date.now();
      if (pendaftaran.start && pendaftaran.end) {
        if (now < pendaftaran.start || now > pendaftaran.end) {
          locked = true;
          if (!dateStr && pendaftaran.start && pendaftaran.end) {
            dateStr = `${formatMs(pendaftaran.start)} hingga ${formatMs(pendaftaran.end)}`;
          }
        }
      }
    }

    setIsTimeLocked(locked);
    if (dateStr) setLockDates(dateStr);
  }, [timeline]);

  const [files, setFiles] = useState<{
    ketuaKtm: File | null;
    anggota1Ktm: File | null;
    anggota2Ktm: File | null;
    ketuaFollowIg: File | null;
    ketuaStoryIg: File | null;
    ketuaTwibbon: File | null;
    anggota1FollowIg: File | null;
    anggota1StoryIg: File | null;
    anggota1Twibbon: File | null;
    anggota2FollowIg: File | null;
    anggota2StoryIg: File | null;
    anggota2Twibbon: File | null;
  }>({
    ketuaKtm: null,
    anggota1Ktm: null,
    anggota2Ktm: null,
    ketuaFollowIg: null,
    ketuaStoryIg: null,
    ketuaTwibbon: null,
    anggota1FollowIg: null,
    anggota1StoryIg: null,
    anggota1Twibbon: null,
    anggota2FollowIg: null,
    anggota2StoryIg: null,
    anggota2Twibbon: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange =
    (field: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (file) {
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
        ];
        if (!allowedTypes.includes(file.type)) {
          setError(
            "File hanya boleh berformat PDF, JPG, atau PNG",
          );
          e.target.value = "";
          return;
        }
        if (file.size > 1 * 1024 * 1024) {
          setError("Ukuran file maksimal 1MB");
          e.target.value = "";
          return;
        }
      }
      setFiles((prev) => ({ ...prev, [field]: file }));
      setError("");
    };

  const uploadFile = async (
    file: File,
    field: string,
  ): Promise<{
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }> => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("teamName", formData.teamName || "unknown");
    payload.append("stage", "administrasi");

    const { uploadFile } = await import("@/app/lib/action/upload");
    const result = await uploadFile(payload);

    if (!result.ok) {
      throw new Error(result.error || `Upload ${field} gagal.`);
    }

    return {
      url: result.url || "",
      fileName: result.fileName || file.name,
      fileSize: result.fileSize || file.size,
      fileType: result.fileType || file.type,
    };
  };

  const steps = [
    { id: 1, title: "Data Tim & Kategori" },
    { id: 2, title: "Data Ketua & Anggota" },
  ];

  const handleNext = () => {
    setError("");
    if (
      currentStep === 1 &&
      (!formData.category || !formData.teamName || !formData.institution)
    ) {
      setError("Harap lengkapi semua field di langkah ini!");
      return;
    }
    if (currentStep === 2) {
      if (
        !formData.leaderName ||
        !formData.leaderNim ||
        !formData.leaderWa ||
        !formData.leaderEmail ||
        !formData.leaderPassword
      ) {
        setError("Harap lengkapi data wajib Ketua Tim!");
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== steps.length) return;
    if (!files.ketuaKtm) {
      setError("Kartu pelajar/mahasiswa ketua tim wajib diunggah!");
      return;
    }
    if (!files.ketuaFollowIg) {
      setError("Bukti Follow IG ketua tim wajib diunggah!");
      return;
    }
    if (!files.ketuaStoryIg) {
      setError("Bukti Story IG ketua tim wajib diunggah!");
      return;
    }
    if (!files.ketuaTwibbon) {
      setError("Bukti Twibbon ketua tim wajib diunggah!");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      let leaderKtmFile: any = null;
      let member1KtmFile: any = null;
      let member2KtmFile: any = null;
      let ketuaFollowIgFile: any = null;
      let ketuaStoryIgFile: any = null;
      let ketuaTwibbonFile: any = null;
      let anggota1FollowIgFile: any = null;
      let anggota1StoryIgFile: any = null;
      let anggota1TwibbonFile: any = null;
      let anggota2FollowIgFile: any = null;
      let anggota2StoryIgFile: any = null;
      let anggota2TwibbonFile: any = null;

      try {
        if (files.ketuaKtm) leaderKtmFile = await uploadFile(files.ketuaKtm, "ketua_ktm");
        if (files.anggota1Ktm) member1KtmFile = await uploadFile(files.anggota1Ktm, "anggota1_ktm");
        if (files.anggota2Ktm) member2KtmFile = await uploadFile(files.anggota2Ktm, "anggota2_ktm");
        if (files.ketuaFollowIg) ketuaFollowIgFile = await uploadFile(files.ketuaFollowIg, "ketua_follow_ig");
        if (files.ketuaStoryIg) ketuaStoryIgFile = await uploadFile(files.ketuaStoryIg, "ketua_story_ig");
        if (files.ketuaTwibbon) ketuaTwibbonFile = await uploadFile(files.ketuaTwibbon, "ketua_twibbon");
        if (files.anggota1FollowIg) anggota1FollowIgFile = await uploadFile(files.anggota1FollowIg, "anggota1_follow_ig");
        if (files.anggota1StoryIg) anggota1StoryIgFile = await uploadFile(files.anggota1StoryIg, "anggota1_story_ig");
        if (files.anggota1Twibbon) anggota1TwibbonFile = await uploadFile(files.anggota1Twibbon, "anggota1_twibbon");
        if (files.anggota2FollowIg) anggota2FollowIgFile = await uploadFile(files.anggota2FollowIg, "anggota2_follow_ig");
        if (files.anggota2StoryIg) anggota2StoryIgFile = await uploadFile(files.anggota2StoryIg, "anggota2_story_ig");
        if (files.anggota2Twibbon) anggota2TwibbonFile = await uploadFile(files.anggota2Twibbon, "anggota2_twibbon");
      } catch (uploadErr) {
        const message =
          uploadErr instanceof Error ? uploadErr.message : "Gagal upload file.";
        setError(message);
        setIsLoading(false);
        return;
      }

      const { registerUser } = await import("@/app/lib/action/auth");
      const result = await registerUser({
        ...formData,
        leaderKtmFile,
        member1KtmFile,
        member2KtmFile,
        ketuaFollowIgFile,
        ketuaStoryIgFile,
        ketuaTwibbonFile,
        anggota1FollowIgFile,
        anggota1StoryIgFile,
        anggota1TwibbonFile,
        anggota2FollowIgFile,
        anggota2StoryIgFile,
        anggota2TwibbonFile,
      });

      if (!result.ok) {
        setError(result.error || "Terjadi kesalahan saat submit.");
        setIsLoading(false);
        return;
      }

      setCurrentStep(3);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      console.error("[CLIENT] Submit error:", err);
      setError(message);
      setIsLoading(false);
    }
  };

  const ketuaKtmRef = React.useRef<HTMLInputElement | null>(null);
  const anggota1Ref = React.useRef<HTMLInputElement | null>(null);
  const anggota2Ref = React.useRef<HTMLInputElement | null>(null);

  if (isTimeLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-6">
          <Lock size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Pendaftaran Belum Dibuka / Telah Ditutup
        </h1>
        <p className="text-slate-600 max-w-md">
          Pendaftaran dibuka mulai {lockDates || "21 Juli 2026 hingga 31 Agustus 2026"}. Silakan
          periksa kembali jadwal kegiatan (Timeline).
        </p>
        <Link href="/">
          <Button className="mt-8">Kembali ke Beranda</Button>
        </Link>
        <button
          onClick={() => {
            localStorage.setItem("debug_time_bypass", "true");
            window.location.reload();
          }}
          className="mt-12 text-xs text-slate-400 hover:text-slate-600"
        >
          [Bypass Waktu (Mode Admin)]
        </button>
      </div>
    );
  }

  const FileUploadItem = ({ title, desc, field, isRequired }: { title: string; desc: string; field: keyof typeof files; isRequired?: boolean }) => {
    return (
      <label className="border border-dashed border-white/30 bg-white/5 rounded-[1.2rem] p-5 text-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 cursor-pointer group mt-4 shadow-sm backdrop-blur-sm block">
        <div className="w-14 h-14 bg-white/20 text-white rounded-[1rem] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner border border-white/20">
          <FileImage size={24} />
        </div>
        <p className="text-sm font-bold text-white group-hover:drop-shadow-md transition-all">
          {title}
        </p>
        <p className="text-xs text-white/60 mt-1 font-medium">
          {desc} {isRequired ? "(Wajib, PDF/JPG/PNG, maks. 1MB)" : "(Opsional, PDF/JPG/PNG, maks. 1MB)"}
        </p>
        {files[field] && (
          <p className="text-xs text-green-300 mt-2 font-medium">
            Dipilih: {files[field]?.name}
          </p>
        )}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange(field)}
        />
      </label>
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Steps */}
        <div className="mb-6 relative z-10">
          <Link
            href="/"
            className="text-white/90 font-medium hover:text-white hover:underline text-sm flex items-center gap-1 drop-shadow-md"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden relative z-10">
          {/* Header Area */}
          <div className="bg-white/5 px-8 py-10 text-white relative border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <p className="text-yellow-200 font-bold text-sm tracking-wider uppercase mb-2 relative z-10 drop-shadow-sm">
              {currentStep <= steps.length
                ? `LANGKAH ${currentStep} DARI ${steps.length}`
                : "SELESAI"}
            </p>
            <h1 className="text-3xl md:text-4xl font-black relative z-10 drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-400 pb-1">
              {currentStep <= steps.length
                ? steps[currentStep - 1].title
                : "Pendaftaran Berhasil"}
            </h1>

            <div className="flex items-center gap-2 mt-8 relative z-10">
              {steps.map((step) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-[1.2rem] font-bold text-sm transition-all duration-300 shadow-sm ${
                      step.id === currentStep
                        ? "bg-white/20 text-white border border-white/30 backdrop-blur-md scale-110 shadow-inner"
                        : step.id < currentStep
                          ? "bg-white/10 text-white/50 border border-white/10"
                          : "bg-black/10 text-white/30 border border-white/5"
                    }`}
                  >
                    {step.id < currentStep ? <Check size={24} /> : step.id}
                  </div>
                  {step.id !== steps.length && (
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step.id < currentStep ? "bg-white/30" : "bg-black/10"}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 md:p-10 relative">
            {currentStep === 1 && (
              <div className="space-y-6 animate-entrance relative z-10">
                <div className="bg-orange-500/20 border-l-4 border-orange-400 p-4 rounded-r-xl mb-8 text-sm text-orange-100 shadow-sm flex items-start gap-3 backdrop-blur-md">
                  <Info className="text-orange-300 shrink-0 mt-0.5" size={20} />
                  <p className="font-medium drop-shadow-sm">
                    Pastikan data yang diisi sudah benar. Semua pengumpulan
                    karya/abstrak akan dilakukan di Dashboard setelah
                    pendaftaran selesai.
                  </p>
                </div>

                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-white drop-shadow-sm">
                    Kategori Lomba <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    className="flex h-12 w-full rounded-[0.8rem] border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 transition-all cursor-pointer [&>option]:text-slate-900"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      -- Pilih Kategori Lomba --
                    </option>
                    <option value="lkti">Karya Tulis Ilmiah (Mahasiswa)</option>
                    <option value="essay">Essay (Mahasiswa)</option>
                    <option value="poster">
                      Desain Poster (SMA/Sederajat)
                    </option>
                  </select>
                </div>

                <div className="space-y-5 mt-6">
                  <Input
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    label="Nama Tim"
                    placeholder="Masukkan nama tim"
                    variant="glass"
                    required
                  />
                  <Input
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    label="Asal Instansi / Sekolah / Universitas"
                    placeholder="Contoh: Universitas Gadjah Mada"
                    variant="glass"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-12 animate-entrance relative z-10">
                {/* Ketua Tim */}
                <div className="space-y-5 bg-black/10 p-6 rounded-[1.5rem] border border-white/10 backdrop-blur-sm">
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 flex items-center gap-3 drop-shadow-sm pb-1">
                    <div className="w-10 h-10 rounded-[0.8rem] bg-white/20 border border-white/30 text-white flex items-center justify-center text-sm shadow-inner backdrop-blur-md">
                      1
                    </div>
                    Data Ketua Tim (Wajib)
                  </h2>
                  <div className="space-y-5 mt-6">
                    <Input
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleChange}
                      label="Nama Lengkap Ketua"
                      placeholder="Sesuai Kartu Pelajar / KTM"
                      variant="glass"
                      required
                    />
                    <Input
                      name="leaderNim"
                      value={formData.leaderNim}
                      onChange={handleChange}
                      label="NIM / NISN / NIS"
                      placeholder="Masukkan Nomor Induk"
                      variant="glass"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        name="leaderWa"
                        value={formData.leaderWa}
                        onChange={handleChange}
                        label="Nomor WhatsApp"
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        variant="glass"
                        required
                      />
                      <Input
                        name="leaderEmail"
                        value={formData.leaderEmail}
                        onChange={handleChange}
                        label="Email Aktif"
                        type="email"
                        placeholder="email@contoh.com"
                        variant="glass"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        name="leaderPassword"
                        value={formData.leaderPassword}
                        onChange={handleChange}
                        label="Kata Sandi (Password)"
                        type="password"
                        placeholder="Untuk login ke Dashboard"
                        variant="glass"
                        required
                      />
                      <Input
                        label="Konfirmasi Kata Sandi"
                        type="password"
                        placeholder="Ulangi password"
                        variant="glass"
                        required
                      />
                    </div>
                    <FileUploadItem title="Upload Scan Kartu Pelajar/Mahasiswa" desc="Ketua Tim" field="ketuaKtm" isRequired={true} />
                    <FileUploadItem title="Upload Bukti Follow IG" desc="Ketua Tim" field="ketuaFollowIg" isRequired={true} />
                    <FileUploadItem title="Upload Bukti Story IG" desc="Ketua Tim" field="ketuaStoryIg" isRequired={true} />
                    <FileUploadItem title="Upload Bukti Twibbon" desc="Ketua Tim" field="ketuaTwibbon" isRequired={true} />
                  </div>
                </div>

                {/* Anggota 1 */}
                <div className="space-y-5 px-2">
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-between drop-shadow-sm pb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[0.8rem] bg-white/10 border border-white/10 text-white/70 flex items-center justify-center text-sm shadow-inner">
                        2
                      </div>
                      Data Anggota 1
                    </div>
                    <span className="text-[10px] font-bold bg-white/10 text-white/70 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                      Opsional
                    </span>
                  </h2>
                  <div className="space-y-5 mt-4">
                    <Input
                      name="member1Name"
                      value={formData.member1Name}
                      onChange={handleChange}
                      label="Nama Lengkap Anggota 1"
                      placeholder="Kosongkan jika tidak ada"
                      variant="glass"
                    />
                    <Input
                      name="member1Nim"
                      value={formData.member1Nim}
                      onChange={handleChange}
                      label="NIM / NISN / NIS Anggota 1"
                      placeholder="Kosongkan jika tidak ada"
                      variant="glass"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        name="member1Wa"
                        value={formData.member1Wa}
                        onChange={handleChange}
                        label="Nomor WhatsApp Anggota 1"
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        variant="glass"
                      />
                      <Input
                        name="member1Email"
                        value={formData.member1Email}
                        onChange={handleChange}
                        label="Email Aktif Anggota 1"
                        type="email"
                        placeholder="email@contoh.com"
                        variant="glass"
                      />
                    </div>
                    <FileUploadItem title="Upload Scan Kartu Pelajar/Mahasiswa" desc="Anggota 1" field="anggota1Ktm" />
                    <FileUploadItem title="Upload Bukti Follow IG" desc="Anggota 1" field="anggota1FollowIg" />
                    <FileUploadItem title="Upload Bukti Story IG" desc="Anggota 1" field="anggota1StoryIg" />
                    <FileUploadItem title="Upload Bukti Twibbon" desc="Anggota 1" field="anggota1Twibbon" />
                  </div>
                </div>

                {/* Anggota 2 */}
                <div className="space-y-5 border-t border-white/10 pt-8 px-2">
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-between drop-shadow-sm pb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[0.8rem] bg-white/10 border border-white/10 text-white/70 flex items-center justify-center text-sm shadow-inner">
                        3
                      </div>
                      Data Anggota 2
                    </div>
                    <span className="text-[10px] font-bold bg-white/10 text-white/70 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                      Opsional
                    </span>
                  </h2>
                  <div className="space-y-5 mt-4">
                    <Input
                      name="member2Name"
                      value={formData.member2Name}
                      onChange={handleChange}
                      label="Nama Lengkap Anggota 2"
                      placeholder="Kosongkan jika tidak ada"
                      variant="glass"
                    />
                    <Input
                      name="member2Nim"
                      value={formData.member2Nim}
                      onChange={handleChange}
                      label="NIM / NISN / NIS Anggota 2"
                      placeholder="Kosongkan jika tidak ada"
                      variant="glass"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        name="member2Wa"
                        value={formData.member2Wa}
                        onChange={handleChange}
                        label="Nomor WhatsApp Anggota 2"
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        variant="glass"
                      />
                      <Input
                        name="member2Email"
                        value={formData.member2Email}
                        onChange={handleChange}
                        label="Email Aktif Anggota 2"
                        type="email"
                        placeholder="email@contoh.com"
                        variant="glass"
                      />
                    </div>
                    <FileUploadItem title="Upload Scan Kartu Pelajar/Mahasiswa" desc="Anggota 2" field="anggota2Ktm" />
                    <FileUploadItem title="Upload Bukti Follow IG" desc="Anggota 2" field="anggota2FollowIg" />
                    <FileUploadItem title="Upload Bukti Story IG" desc="Anggota 2" field="anggota2StoryIg" />
                    <FileUploadItem title="Upload Bukti Twibbon" desc="Anggota 2" field="anggota2Twibbon" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-entrance text-center py-16 relative z-10">
                <div className="w-32 h-32 bg-white/20 border-2 border-white/40 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner backdrop-blur-md">
                  <Check size={64} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mb-4 drop-shadow-md pb-1">
                  Pendaftaran Berhasil!
                </h2>
                <p className="text-white/80 mb-12 max-w-md mx-auto leading-relaxed text-lg font-medium drop-shadow-sm">
                  Data pendaftaranmu sedang diproses. Silakan masuk ke Dashboard
                  untuk melihat status verifikasi.
                </p>
                <Link href="/login">
                  <Button
                    type="button"
                    className="bg-white/20 text-white border border-white/40 hover:bg-white/30 backdrop-blur-md px-12 py-5 text-lg font-bold rounded-[1.5rem] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                  >
                    Masuk ke Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            {error && (
              <div className="bg-red-500/20 text-red-100 p-4 rounded-xl text-sm border border-red-500/50 shadow-sm backdrop-blur-md font-medium text-center relative z-10 mt-6">
                {error}
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    className="flex-1 py-4 text-base border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white font-bold rounded-[1.2rem] backdrop-blur-sm transition-all shadow-sm"
                  >
                    Kembali
                  </Button>
                )}
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 text-base flex items-center justify-center gap-2 bg-white/20 border border-white/40 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white/30 text-white font-bold rounded-[1.2rem] backdrop-blur-md transition-all"
                  >
                    Selanjutnya
                    <ChevronRight size={20} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 text-base flex items-center justify-center gap-2 bg-white/20 border border-white/40 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white/30 text-white font-bold rounded-[1.2rem] backdrop-blur-md transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </div>
                    ) : (
                      <>
                        Selesaikan Pendaftaran
                        <Check size={20} />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
