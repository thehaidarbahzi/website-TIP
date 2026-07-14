"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Send } from "lucide-react";
import Link from "next/link";

export default function JuriScorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamName = searchParams.get("team");

  const [team, setTeam] = useState<any>(null);
  const [skor, setSkor] = useState(0);
  const [catatan, setCatatan] = useState("");
  const [existingScore, setExistingScore] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(teamName || "");

  useEffect(() => {
    async function load() {
      const { getCurrentUser } = await import("@/app/lib/action/auth");
      const session = await getCurrentUser();
      if (!session) return;
      const { getTeamsWithSubmissions } = await import("@/app/lib/action/penilaian");
      const data = await getTeamsWithSubmissions();
      setAllTeams(data);

      const target = teamName
        ? data.find((t: any) => t.teamName === teamName)
        : data[0];
      if (target) {
        setTeam(target);
        setSelectedTeam(target.teamName);
        const existing = target.penilaian?.[session.user_id];
        if (existing) {
          setExistingScore(existing);
          setSkor(existing.skor);
          setCatatan(existing.catatan);
        } else {
          setExistingScore(null);
          setSkor(0);
          setCatatan("");
        }
      }
    }
    load();
  }, [teamName]);

  async function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.value;
    router.replace(`/dashboard/score?team=${name}`);
    const target = allTeams.find((t: any) => t.teamName === name);
    if (target) {
      setTeam(target);
      setSelectedTeam(name);
      const { getCurrentUser } = await import("@/app/lib/action/auth");
      const session = await getCurrentUser();
      if (session) {
        const existing = target.penilaian?.[session.user_id];
        if (existing) {
          setExistingScore(existing);
          setSkor(existing.skor);
          setCatatan(existing.catatan);
        } else {
          setExistingScore(null);
          setSkor(0);
          setCatatan("");
        }
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!team) return;
    const { submitScore } = await import("@/app/lib/action/penilaian");
    const res = await submitScore({ teamName: team.teamName, skor, catatan });
    if (res.ok) {
      setMsg("Nilai berhasil disimpan!");
      setExistingScore({ skor, catatan });
      setTimeout(() => setMsg(""), 3000);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/dashboard/submissions"
        className="text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Submissions
      </Link>

      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Beri Nilai
      </h1>

      {msg && (
        <div className="bg-green-500/20 text-green-100 border border-green-400/30 p-4 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-white mb-2 block">Pilih Tim</label>
        <select
          value={selectedTeam}
          onChange={handleTeamChange}
          className="w-full h-12 px-4 rounded-[1rem] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
        >
          {allTeams.map((t: any) => (
            <option key={t.teamName} value={t.teamName} className="text-slate-900">
              {t.teamName} ({t.category})
            </option>
          ))}
        </select>
      </div>

      {team && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-sm pb-1">
              {team.teamName}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60 font-medium">Kategori</p>
                <p className="font-bold text-white">{team.category}</p>
              </div>
              <div>
                <p className="text-white/60 font-medium">Instansi</p>
                <p className="font-bold text-white">{team.institution}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-white/60 font-medium mb-1">Judul Abstrak</p>
              <p className="font-bold text-white">{team.abstrak?.title || "-"}</p>
              <p className="text-white/60 font-medium mt-3 mb-1">Subtema</p>
              <p className="font-bold text-white">{team.abstrak?.subtema || "-"}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4">
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-sm pb-1 flex items-center gap-2">
              <Star size={20} />
              Penilaian
            </h2>

            <div>
              <label className="text-sm font-bold text-white mb-2 block">
                Skor (0-100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={skor}
                onChange={(e) => setSkor(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-[1rem] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-white mb-2 block">
                Catatan
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-[1rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20 resize-none"
                placeholder="Catatan penilaian..."
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 text-yellow-300 font-bold rounded-[1rem] transition-all"
            >
              <Send size={20} />
              {existingScore ? "Update Nilai" : "Simpan Nilai"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
