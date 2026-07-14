"use client";

import React, { useState } from "react";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { loginUser } from "@/app/lib/action/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(
        new FormData(e.target as HTMLFormElement),
      );
      if (result?.redirect) {
        window.location.href = result.redirect;
        return;
      }
      if (result?.message) {
        setError(result.message);
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="text-white/90 font-medium hover:text-white hover:underline text-sm flex items-center gap-1 mb-8 drop-shadow-md"
        >
          &larr; Kembali ke Beranda
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-3xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden animate-entrance group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="px-8 pt-10 pb-6 text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 text-white rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner backdrop-blur-md">
              <LogIn size={32} />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
              Login Dashboard
            </h1>
            <p className="text-white/80 text-sm mt-1 font-medium">
              Masuk untuk mengelola pendaftaran dan mengumpulkan karya
            </p>
          </div>

          <form
            className="px-8 pb-8 space-y-6 relative z-10"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
          >
            {error && (
              <div className="bg-red-500/20 text-red-100 p-3 rounded-xl text-sm border border-red-500/50 shadow-sm backdrop-blur-md font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <Input
                  label="Email Terdaftar"
                  type="email"
                  name="email"
                  placeholder="Masukkan email ketua tim"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="glass"
                  required
                />
              </div>
              <div className="space-y-1">
                <Input
                  label="Kata Sandi"
                  type="password"
                  name="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="glass"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white/20 border border-white/30 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white/30 text-white rounded-[1.2rem] font-bold transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-white/70 font-medium">
                Belum punya akun?{" "}
                <Link
                  href="/pendaftaran"
                  className="text-white font-bold hover:underline transition-colors drop-shadow-sm"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>

            <div className="pt-6 text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Apakah Anda yakin ingin menghapus semua data pendaftaran lokal?",
                    )
                  ) {
                    localStorage.clear();
                    alert("Semua data pendaftaran dan sesi telah dibersihkan!");
                    window.location.reload();
                  }
                }}
                className="text-[10px] text-white/40 hover:text-red-400 font-bold uppercase tracking-widest transition-colors"
              >
                [Reset Local Storage]
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
