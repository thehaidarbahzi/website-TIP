"use client";

import React, { useEffect, useState } from "react";
import { Users, FileImage, ShieldCheck, Clock, XCircle } from "lucide-react";

type TeamData = {
  teamName: string;
  institution: string;
  category: string;
  status: string;
  leaderName: string;
  leaderNim: string;
  leaderEmail: string;
  leaderWa: string;
  leaderKtmFile?: { url: string; fileName: string };
  member1Name?: string;
  member1Nim?: string;
  member1KtmFile?: { url: string; fileName: string };
  member2Name?: string;
  member2Nim?: string;
  member2KtmFile?: { url: string; fileName: string };
};

const CATEGORY_MAP: Record<string, string> = {
  lkti: "Karya Tulis Ilmiah (Mahasiswa)",
  essay: "Essay (Mahasiswa)",
  poster: "Desain Poster (SMA/Sederajat)",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  verified: {
    label: "Tim Terverifikasi",
    icon: <ShieldCheck size={20} />,
    color: "text-green-300",
    bg: "bg-green-500/20 border-green-400/30",
  },
  pending: {
    label: "Menunggu Verifikasi",
    icon: <Clock size={20} />,
    color: "text-yellow-300",
    bg: "bg-yellow-500/20 border-yellow-400/30",
  },
  rejected: {
    label: "Tim Ditolak",
    icon: <XCircle size={20} />,
    color: "text-red-300",
    bg: "bg-red-500/20 border-red-400/30",
  },
};

export default function MyTeamPage() {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { getMyTeam } = await import("@/app/lib/action/auth");
        const data = await getMyTeam();
        setTeam(data);
      } catch {
        setTeam(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white/60 font-medium">Memuat data tim...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-entrance relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-white drop-shadow-md" size={28} />
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
            My Team
          </h1>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-white/30" />
          <p className="text-lg font-bold text-white/70 mb-2">
            Belum ada data tim
          </p>
          <p className="text-sm text-white/50">
            Tim Anda belum terdaftar atau sedang dalam proses verifikasi.
          </p>
        </div>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[team.status] || STATUS_CONFIG.pending;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <Users className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          My Team
        </h1>
      </div>

      {/* Status Badge */}
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-[1rem] border ${statusConf.bg} ${statusConf.color} font-bold backdrop-blur-xl`}
      >
        {statusConf.icon}
        {statusConf.label}
      </div>

      {/* General Info */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-white/20 pb-3 mb-4 drop-shadow-sm">
          Informasi Umum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70 font-medium">Nama Tim</p>
            <p className="font-bold text-white text-lg">{team.teamName}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">
              Asal Instansi
            </p>
            <p className="font-bold text-white text-lg">
              {team.institution}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">
              Kategori Lomba
            </p>
            <p className="font-bold text-white text-lg">
              {CATEGORY_MAP[team.category] || team.category}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm pb-1">
          Anggota Tim
        </h2>

        {/* Ketua */}
        <MemberCard
          role="Ketua Tim"
          primary
          name={team.leaderName}
          nim={team.leaderNim}
          email={team.leaderEmail}
          wa={team.leaderWa}
          ktmFile={team.leaderKtmFile}
        />

        {team.member1Name && (
          <MemberCard
            role="Anggota 1"
            name={team.member1Name}
            nim={team.member1Nim}
            ktmFile={team.member1KtmFile}
          />
        )}

        {team.member2Name && (
          <MemberCard
            role="Anggota 2"
            name={team.member2Name}
            nim={team.member2Nim}
            ktmFile={team.member2KtmFile}
          />
        )}
      </div>
    </div>
  );
}

function MemberCard({
  role,
  primary,
  name,
  nim,
  email,
  wa,
  ktmFile,
}: {
  role: string;
  primary?: boolean;
  name: string;
  nim?: string;
  email?: string;
  wa?: string;
  ktmFile?: { url: string; fileName: string };
}) {
  return (
    <div
      className={`backdrop-blur-md border rounded-[1.5rem] p-6 shadow-inner ${
        primary
          ? "bg-black/10 border-white/20"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`border text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
            primary
              ? "bg-white/20 border-white/30"
              : "bg-white/10 border-white/20"
          }`}
        >
          {role}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <p
            className={`text-sm font-medium ${
              primary ? "text-white/70" : "text-white/60"
            }`}
          >
            Nama Lengkap
          </p>
          <p className="font-bold text-white text-lg">{name}</p>
        </div>
        {nim && (
          <div>
            <p
              className={`text-sm font-medium ${
                primary ? "text-white/70" : "text-white/60"
              }`}
            >
              NIM / NISN
            </p>
            <p className="font-bold text-white text-lg">{nim}</p>
          </div>
        )}
        {email && (
          <div>
            <p className="text-sm text-white/70 font-medium">Email</p>
            <p className="font-bold text-white text-lg">{email}</p>
          </div>
        )}
        {wa && (
          <div>
            <p className="text-sm text-white/70 font-medium">
              No. WhatsApp
            </p>
            <p className="font-bold text-white text-lg">{wa}</p>
          </div>
        )}
        <div className={email && wa ? "md:col-span-2 lg:col-span-1" : ""}>
          <p
            className={`text-sm font-medium mb-1 ${
              primary ? "text-white/70" : "text-white/60"
            }`}
          >
            Kartu Identitas
          </p>
          <div
            className={`flex items-center gap-2 text-white border p-2.5 rounded-[0.8rem] text-sm w-fit backdrop-blur-sm shadow-inner ${
              primary
                ? "bg-white/10 border-white/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <FileImage size={18} />
            <span className="font-bold">
              {ktmFile ? "Telah Diunggah" : "Belum Diunggah"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
