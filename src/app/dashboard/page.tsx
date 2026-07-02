import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ChevronRight, FileText, Info } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 animate-entrance delay-100">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header / Welcome Banner */}
        <div className="bg-gradient-brand rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg animate-entrance delay-200">
          <div className="relative z-10">
            <p className="text-white/80 text-sm md:text-base font-medium mb-1">Selamat datang,</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Peserta Inovatif</h1>
            <p className="text-white/90 text-sm">
              Anda terdaftar di <span className="font-bold">1 program</span>
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl animate-blob"></div>
          <div className="absolute right-[10%] bottom-[-20%] w-40 h-40 bg-[var(--color-brand-purple-dark)] opacity-30 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="flex items-center justify-between mt-8 mb-4 animate-entrance delay-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Program Saya</h2>
          <Link href="/pendaftaran" className="text-sm font-medium text-[var(--color-brand-purple)] hover:underline">
            Lihat Semua
          </Link>
        </div>

        {/* Program Card */}
        <Link href="/pendaftaran" className="block animate-entrance delay-300">
          <GlassCard className="transition-transform hover:scale-[1.02] cursor-pointer bg-white/50 dark:bg-slate-900/50 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-[var(--color-brand-purple)] shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tech Innovation Paper 2026</h3>
                  <p className="text-sm text-slate-500 mt-1">Lomba Karya Tulis Ilmiah Nasional</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Tahap saat ini:</span>
                    <span className="text-xs font-bold text-[var(--color-brand-orange)] bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
                      Pendaftaran Terbuka
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-[var(--color-brand-purple)] bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">
                  0/5
                </span>
                <ChevronRight className="text-slate-400 mt-2" />
              </div>
            </div>
          </GlassCard>
        </Link>

        {/* Tips Card */}
        <div className="mt-6 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3 animate-entrance delay-300 glass">
          <div className="text-blue-500 shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">TIPS</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Pastikan dokumen karya tulis yang Anda unggah sudah sesuai dengan format panduan lomba dan dapat diakses oleh dewan juri.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
