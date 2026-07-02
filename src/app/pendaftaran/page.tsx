"use client";

import { FileText } from "lucide-react";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Data Tim & Asal Sekolah/Kampus" },
  { id: 2, title: "Data Ketua & Anggota" },
  { id: 3, title: "Upload Dokumen & Karya" }
];

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/pendaftaran/sukses");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Stepper Header */}
        <div className="mb-8">
          <p className="text-[var(--color-brand-orange)] font-bold text-sm tracking-wider uppercase mb-2">
            LANGKAH {currentStep} DARI {steps.length}
          </p>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {steps[currentStep - 1].title}
          </h1>
          
          <div className="flex items-center gap-2 mt-4">
            {steps.map((step) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
                    step.id === currentStep 
                      ? "bg-[var(--color-brand-purple)] text-white" 
                      : step.id < currentStep 
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                {step.id !== steps.length && (
                  <div className={`h-1 flex-1 rounded-full ${step.id < currentStep ? "bg-green-500" : "bg-slate-200 dark:bg-slate-800"}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <GlassCard>
          {currentStep === 1 && (
            <div className="space-y-4 animate-entrance">
              <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                Informasi Umum
              </h2>
              <Input label="Nama Tim" placeholder="Masukkan nama tim" required />
              <Input label="Asal Instansi / Sekolah / Universitas" placeholder="Masukkan asal instansi" required />
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori Lomba <span className="text-red-500">*</span></label>
                <select className="flex h-11 w-full rounded-xl border bg-white/50 px-3 py-2 text-sm border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-purple)]">
                  <option value="">Pilih kategori</option>
                  <option value="ktin">Karya Tulis Ilmiah (Mahasiswa)</option>
                  <option value="poster">Desain Poster (SMA/Sederajat)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-entrance delay-100">
              <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                Data Ketua Tim & Akun
              </h2>
              <Input label="Nama Lengkap Ketua" placeholder="Sesuai kartu pelajar/KTM" required />
              <Input label="Nomor WhatsApp" type="tel" placeholder="08xxxxxxxxxx" required />
              <Input label="Email Aktif" type="email" placeholder="email@contoh.com" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Kata Sandi" type="password" placeholder="Minimal 8 karakter" required />
                <Input label="Konfirmasi Kata Sandi" type="password" placeholder="Ketik ulang kata sandi" required />
              </div>
              
              <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 mt-8">
                Data Anggota 1 (Opsional)
              </h2>
              <Input label="Nama Lengkap Anggota 1" placeholder="Sesuai kartu pelajar/KTM" />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-entrance delay-200">
              <h2 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                Unggah Dokumen
              </h2>
              
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-[var(--color-brand-purple)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Klik untuk unggah Karya Tulis / Poster</p>
                <p className="text-xs text-slate-500 mt-1">Format PDF/PNG maksimal 10MB</p>
                <input type="file" className="hidden" />
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Klik untuk unggah Scan Kartu Pelajar / KTM</p>
                <p className="text-xs text-slate-500 mt-1">Digabung dalam 1 file PDF jika lebih dari 1 anggota</p>
              </div>

              <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-[var(--color-brand-orange)] focus:ring-[var(--color-brand-orange)]" required />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Saya menyatakan bahwa semua data dan karya yang diunggah adalah benar, orisinal, dan dapat dipertanggungjawabkan.
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrev} className="flex-1">
                Sebelumnya
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2">
              {currentStep === steps.length ? "Kirim Pendaftaran" : "Selanjutnya"}
              {currentStep !== steps.length && <ChevronRight size={18} />}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
