import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, FileCheck2, ArrowLeft } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        
        <GlassCard className="text-center p-8 md:p-12 relative overflow-hidden">
          {/* Confetti / Success Background Effect */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[var(--color-brand-purple)] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
              Formulir Anda sudah terkirim dan sedang dalam proses review. Data yang terkirim tidak dapat diubah kembali.
            </p>

            <div className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                <FileCheck2 size={18} className="text-[var(--color-brand-purple)]" />
                Ringkasan Pendaftaran
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">ID Pendaftaran</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">TIP-26-08492</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Kategori Lomba</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Karya Tulis Ilmiah</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md font-semibold text-xs">Menunggu Review</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link href="/" className="flex-1">
                <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                  <ArrowLeft size={18} />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* Feedback Banner */}
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between text-center sm:text-left">
          <div>
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Bagaimana pengalaman pendaftaran Anda?</h4>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Saran Anda sangat membantu kami memperbaiki sistem.</p>
          </div>
          <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 focus:ring-red-500 shrink-0">
            Berikan Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
