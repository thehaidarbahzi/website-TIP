import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8 relative">
      
      {/* Decorative blobs for landing page */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--color-brand-purple)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[var(--color-brand-orange)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-8 z-10 animate-entrance delay-100">
        
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--color-brand-purple)]/30 bg-purple-500/10 text-[var(--color-brand-purple)] font-semibold text-sm backdrop-blur-md">
          LPKTA & Cendekia Teknika
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Tech Innovation <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-orange)]">
            Paper 2026
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Wujudkan ide dan inovasimu melalui Lomba Karya Tulis Ilmiah Tingkat Nasional. Jadilah bagian dari generasi emas pembawa perubahan!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-entrance delay-300">
          <Link href="/pendaftaran">
            <Button variant="primary" size="lg" className="w-full sm:w-auto flex items-center gap-2 group">
              Daftar Sekarang
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/90 text-slate-800 dark:bg-slate-800/90 dark:text-white backdrop-blur-sm">
              Masuk ke Akun
            </Button>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
