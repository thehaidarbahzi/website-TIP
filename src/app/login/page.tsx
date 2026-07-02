"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-brand-purple)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-brand-orange)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">TIP 2026</h1>
          <p className="text-slate-600 dark:text-slate-400">Tech Innovation Paper</p>
        </div>

        <GlassCard className="w-full">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Masuk ke Akun</h2>
            <p className="text-sm text-slate-500 mt-1">Selamat datang kembali!</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label="Email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
            />
            
            <Input 
              label="Kata Sandi" 
              type="password" 
              placeholder="Masukkan kata sandi" 
              required 
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-[var(--color-brand-purple)] focus:ring-[var(--color-brand-purple)]" />
                <span className="text-slate-600 dark:text-slate-400">Ingat saya</span>
              </label>
              <a href="#" className="text-[var(--color-brand-purple)] font-medium hover:underline">Lupa kata sandi?</a>
            </div>

            <Button fullWidth type="button" className="mt-4">
              Masuk
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 dark:bg-black/40 text-slate-500">Atau masuk dengan</span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Belum punya akun? </span>
            <Link href="/pendaftaran" className="text-[var(--color-brand-purple)] font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
