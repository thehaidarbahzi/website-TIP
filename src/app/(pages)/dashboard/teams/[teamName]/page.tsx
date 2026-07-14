"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminTeamDetailPage() {
  const params = useParams();
  const teamName = params.teamName as string;
  const [team, setTeam] = useState<any>(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { getAllTeams } = await import("@/app/lib/action/users");
      const all = await getAllTeams();
      const found = all.find((t: any) => t.teamName === teamName);
      setTeam(found || null);
    }
    load();
  }, [teamName]);

  const handleVerify = async (status: "verified" | "rejected") => {
    const { updateTeamStatus } = await import("@/app/lib/action/users");
    const res = await updateTeamStatus(teamName, status);
    if (res.ok) {
      setTeam((prev: any) => ({ ...prev, status }));
      setActionMsg(status === "verified" ? "Tim telah diverifikasi." : "Tim ditolak.");
      setTimeout(() => setActionMsg(""), 3000);
    }
  };

  if (!team) {
    return <div className="p-8 text-white/80">Memuat data tim...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/dashboard/teams"
        className="text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali
      </Link>

      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        {team.teamName}
      </h1>

      {actionMsg && (
        <div className="bg-green-500/20 text-green-100 border border-green-400/30 p-4 rounded-xl text-sm font-medium">
          {actionMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-sm pb-1">
            Informasi Tim
          </h2>
          <InfoRow label="Kategori" value={team.category} />
          <InfoRow label="Instansi" value={team.institution} />
          <InfoRow label="Status" value={team.status || "pending"} />
          <InfoRow label="Tgl Daftar" value={team.registeredAt ? new Date(team.registeredAt).toLocaleDateString("id") : "-"} />
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm pb-1">
            Ketua Tim
          </h2>
          <InfoRow label="Nama" value={team.leaderName} />
          <InfoRow label="NIM" value={team.leaderNim} />
          <InfoRow label="Email" value={team.leaderEmail} />
          <InfoRow label="WA" value={team.leaderWa} />
          {team.leaderKtmFile?.url && (
            <FileLink label="KTM" url={team.leaderKtmFile.url} fileName={team.leaderKtmFile.fileName} />
          )}
        </div>
      </div>

      {(team.member1Name || team.member2Name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.member1Name && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
              <h2 className="text-lg font-black text-white/80 drop-shadow-sm pb-1">
                Anggota 1
              </h2>
              <InfoRow label="Nama" value={team.member1Name} />
              <InfoRow label="NIM" value={team.member1Nim} />
              {team.member1KtmFile?.url && (
                <FileLink label="KTM" url={team.member1KtmFile.url} fileName={team.member1KtmFile.fileName} />
              )}
            </div>
          )}
          {team.member2Name && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
              <h2 className="text-lg font-black text-white/80 drop-shadow-sm pb-1">
                Anggota 2
              </h2>
              <InfoRow label="Nama" value={team.member2Name} />
              <InfoRow label="NIM" value={team.member2Nim} />
              {team.member2KtmFile?.url && (
                <FileLink label="KTM" url={team.member2KtmFile.url} fileName={team.member2KtmFile.fileName} />
              )}
            </div>
          )}
        </div>
      )}

      {team.buktiPembayaran?.url && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 drop-shadow-sm pb-1">
            Pembayaran
          </h2>
          <FileLink label="Bukti Pembayaran" url={team.buktiPembayaran.url} fileName={team.buktiPembayaran.fileName} />
        </div>
      )}

      {team.abstrak && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 drop-shadow-sm pb-1">
            Abstrak
          </h2>
          <InfoRow label="Judul" value={team.abstrak.title} />
          <InfoRow label="Subtema" value={team.abstrak.subtema} />
          <InfoRow label="Status" value={team.abstrak.status} />
          <InfoRow label="Tgl Submit" value={team.abstrak.submittedAt ? new Date(team.abstrak.submittedAt).toLocaleString("id") : "-"} />
          {team.abstrak.file?.webViewLink && (
            <FileLink label="File Abstrak" url={team.abstrak.file.webViewLink} fileName={team.abstrak.file.fileName} />
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => handleVerify("verified")}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 font-bold rounded-[1rem] transition-all"
        >
          <CheckCircle size={20} />
          Verifikasi
        </button>
        <button
          onClick={() => handleVerify("rejected")}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 font-bold rounded-[1rem] transition-all"
        >
          <XCircle size={20} />
          Tolak
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-white/60 font-medium">{label}</p>
      <p className="font-bold text-white">{value || "-"}</p>
    </div>
  );
}

function FileLink({ label, url, fileName }: { label: string; url: string; fileName?: string }) {
  return (
    <div>
      <p className="text-sm text-white/60 font-medium">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-yellow-300 hover:text-yellow-100 font-bold text-sm transition-colors mt-1"
      >
        <Eye size={16} />
        {fileName || "Lihat File"}
      </a>
    </div>
  );
}
