"use client";

import React, { useState } from "react";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import { Check, ChevronRight, FileImage, CreditCard } from "lucide-react";
import Link from "next/link";

const FileUploadBox = ({ title, desc }: { title: string; desc: string }) => (
  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer group mt-2">
    <div className="w-10 h-10 bg-purple-100 text-[var(--color-brand-purple)] rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
      <FileImage size={20} />
    </div>
    <p className="text-sm font-bold text-slate-800">{title}</p>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
    <input type="file" className="hidden" accept="image/*,.pdf" />
  </div>
);

type FormData = {
  category: string;
  teamName: string;
  institution: string;
  leaderName: string;
  leaderNim: string;
  leaderWa: string;
  leaderEmail: string;
  leaderPassword: string;
  member1Name: string;
  member1Nim: string;
  member2Name: string;
  member2Nim: string;
};

type StoredUser = {
  leaderEmail?: string;
  [key: string]: unknown;
};

function getInitialFormData(): FormData {
  if (typeof window === "undefined") {
    return {
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
      member2Name: "",
      member2Nim: "",
    };
  }

  try {
    const stored = localStorage.getItem("tip_registration_data");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<FormData>;
      return {
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
        member2Name: "",
        member2Nim: "",
        ...parsed,
      };
    }
  } catch {}

  return {
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
    member2Name: "",
    member2Nim: "",
  };
}

export default function RegistrationStep1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  const steps = [
    { id: 1, title: "Data Tim & Kategori" },
    { id: 2, title: "Data Ketua & Anggota" },
    { id: 3, title: "Bukti Pembayaran" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (
      currentStep === 1 &&
      (!formData.category || !formData.teamName || !formData.institution)
    ) {
      alert("Harap lengkapi semua field di langkah ini!");
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
        alert("Harap lengkapi data wajib Ketua Tim!");
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== steps.length) return;

    const existingUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("tip_users") || "[]",
    );
    const isEmailExist = existingUsers.some(
      (u) =>
        u.leaderEmail &&
        typeof u.leaderEmail === "string" &&
        u.leaderEmail.trim().toLowerCase() ===
          formData.leaderEmail.trim().toLowerCase(),
    );
    if (isEmailExist) {
      alert("Email sudah terdaftar!");
      return;
    }

    existingUsers.push({
      ...formData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
    });

    localStorage.setItem("tip_users", JSON.stringify(existingUsers));
    localStorage.removeItem("tip_registration_data");
    setCurrentStep(4);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href="/"
          className="text-[var(--color-brand-purple)] font-medium hover:underline text-sm flex items-center gap-1"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[var(--color-brand-purple)] px-8 py-10 text-white">
          <p className="text-purple-200 font-bold text-sm tracking-wider uppercase mb-2">
            {currentStep <= steps.length
              ? `LANGKAH ${currentStep} DARI ${steps.length}`
              : "SELESAI"}
          </p>
          <h1 className="text-3xl font-bold">
            {currentStep <= steps.length
              ? steps[currentStep - 1].title
              : "Pendaftaran Berhasil"}
          </h1>

          <div className="flex items-center gap-2 mt-6">
            {steps.map((step) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
                    step.id === currentStep
                      ? "bg-white text-[var(--color-brand-purple)] shadow-md"
                      : step.id < currentStep
                        ? "bg-green-400 text-slate-900"
                        : "bg-purple-800 text-purple-400"
                  }`}
                >
                  {step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                {step.id !== steps.length && (
                  <div
                    className={`h-1 flex-1 rounded-full ${step.id < currentStep ? "bg-green-400" : "bg-purple-800"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-entrance">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6 text-sm text-orange-800">
                Pastikan data yang diisi sudah benar. Semua pengumpulan
                karya/abstrak akan dilakukan di Dashboard setelah pendaftaran
                selesai.
              </div>

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Kategori Lomba <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  className="flex h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 hover:border-slate-400 transition-all"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Kategori Lomba --</option>
                  <option value="lkti">Karya Tulis Ilmiah (Mahasiswa)</option>
                  <option value="essay">Essay (Mahasiswa)</option>
                  <option value="poster">Desain Poster (SMA/Sederajat)</option>
                </select>
              </div>

              <Input
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                label="Nama Tim"
                placeholder="Masukkan nama tim"
                required
              />
              <Input
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                label="Asal Instansi / Sekolah / Universitas"
                placeholder="Contoh: Universitas Gadjah Mada"
                required
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-10 animate-entrance">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2">
                  Data Ketua Tim (Wajib)
                </h2>
                <Input
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  label="Nama Lengkap Ketua"
                  placeholder="Sesuai Kartu Pelajar / KTM"
                  required
                />
                <Input
                  name="leaderNim"
                  value={formData.leaderNim}
                  onChange={handleChange}
                  label="NIM / NISN / NIS"
                  placeholder="Masukkan Nomor Induk"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="leaderWa"
                    value={formData.leaderWa}
                    onChange={handleChange}
                    label="Nomor WhatsApp"
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    required
                  />
                  <Input
                    name="leaderEmail"
                    value={formData.leaderEmail}
                    onChange={handleChange}
                    label="Email Aktif"
                    type="email"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="leaderPassword"
                    value={formData.leaderPassword}
                    onChange={handleChange}
                    label="Kata Sandi (Password)"
                    type="password"
                    placeholder="Untuk login ke Dashboard"
                    required
                  />
                  <Input
                    label="Konfirmasi Kata Sandi"
                    type="password"
                    placeholder="Ulangi password"
                    required
                  />
                </div>
                <FileUploadBox
                  title="Upload Scan Kartu Pelajar/Mahasiswa"
                  desc="Ketua Tim (PDF/JPG, maks. 2MB)"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center justify-between">
                  Data Anggota 1
                  <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    Opsional
                  </span>
                </h2>
                <Input
                  name="member1Name"
                  value={formData.member1Name}
                  onChange={handleChange}
                  label="Nama Lengkap Anggota 1"
                  placeholder="Kosongkan jika tidak ada"
                />
                <Input
                  name="member1Nim"
                  value={formData.member1Nim}
                  onChange={handleChange}
                  label="NIM / NISN / NIS Anggota 1"
                  placeholder="Kosongkan jika tidak ada"
                />
                <FileUploadBox
                  title="Upload Scan Kartu Pelajar/Mahasiswa"
                  desc="Anggota 1 (Opsional)"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center justify-between">
                  Data Anggota 2
                  <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    Opsional
                  </span>
                </h2>
                <Input
                  name="member2Name"
                  value={formData.member2Name}
                  onChange={handleChange}
                  label="Nama Lengkap Anggota 2"
                  placeholder="Kosongkan jika tidak ada"
                />
                <Input
                  name="member2Nim"
                  value={formData.member2Nim}
                  onChange={handleChange}
                  label="NIM / NISN / NIS Anggota 2"
                  placeholder="Kosongkan jika tidak ada"
                />
                <FileUploadBox
                  title="Upload Scan Kartu Pelajar/Mahasiswa"
                  desc="Anggota 2 (Opsional)"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-entrance">
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl mb-6 text-center">
                <div className="w-16 h-16 bg-white shadow-sm text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Pembayaran Pendaftaran
                </h3>
                <p className="text-purple-800 mb-1">
                  Silakan lakukan transfer pendaftaran ke rekening berikut:
                </p>
                <div className="bg-white px-4 py-3 rounded-lg border border-purple-100 inline-block my-3">
                  <p className="font-bold text-xl tracking-wider text-slate-800">
                    BCA 1234567890
                  </p>
                  <p className="text-sm text-slate-500">
                    a.n. Tech Innovation Paper
                  </p>
                </div>
                <p className="font-semibold text-orange-600">
                  Nominal: <span className="text-lg">(Segera Diumumkan)</span>
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-purple-100 text-[var(--color-brand-purple)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileImage size={32} />
                </div>
                <p className="text-lg font-bold text-slate-800">
                  Unggah Bukti Transaksi
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Maks. 5MB (Format: .jpg, .png, .pdf)
                </p>
                <input type="file" className="hidden" accept="image/*,.pdf" />
              </div>

              <div className="mt-8 bg-orange-50 p-4 rounded-xl border border-orange-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-slate-400 text-[var(--color-brand-orange)] focus:ring-[var(--color-brand-orange)]"
                    required
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Saya menyatakan bahwa semua data dan bukti transaksi yang
                    diunggah adalah asli, benar, dan dapat
                    dipertanggungjawabkan.
                  </span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-entrance text-center py-12">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Pendaftaran Berhasil!
              </h2>
              <p className="text-slate-600 mb-10 max-w-md mx-auto leading-relaxed text-lg">
                Permintaanmu sedang diproses. Menunggu verifikasi dari tim kami.
              </p>
              <Link href="/login">
                <Button
                  type="button"
                  className="bg-slate-900 text-white hover:bg-[var(--color-brand-purple)] px-10 py-4 text-lg font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1"
                >
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          )}

          {currentStep < 4 && (
            <div className="flex gap-4 mt-10 pt-6 border-t-2 border-slate-100">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 py-3 text-base border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Kembali
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 text-base flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-[var(--color-brand-purple)] font-bold transition-colors"
                >
                  Selanjutnya
                  <ChevronRight size={20} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 py-3 text-base flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-[var(--color-brand-purple)] font-bold transition-colors"
                >
                  Selesaikan Pendaftaran
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
