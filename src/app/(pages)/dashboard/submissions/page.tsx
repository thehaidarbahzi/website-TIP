"use client";

import { useEffect, useState } from "react";
import { Eye, Star } from "lucide-react";
import Link from "next/link";

export default function JuriSubmissionsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    async function load() {
      const { getCurrentUser } = await import("@/app/lib/action/auth");
      const session = await getCurrentUser();
      if (!session) return;
      const { getTeamsWithSubmissions } = await import("@/app/lib/action/penilaian");
      const data = await getTeamsWithSubmissions();
      setTeams(data.map((t: any) => ({ ...t, juriId: session.user_id })));
    }
    load();
  }, []);

  const filtered = filterCat === "all" ? teams : teams.filter((t) => t.category === filterCat);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Submissions
      </h1>

      <div className="flex gap-2">
        {["all", "lkti", "essay", "poster"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-4 py-2 rounded-[1rem] font-bold text-sm transition-all ${
              filterCat === cat
                ? "bg-white/20 text-white border border-white/30"
                : "bg-white/5 text-white/50 hover:bg-white/10 border border-transparent"
            }`}
          >
            {cat === "all" ? "Semua" : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-12 text-center text-white/50">
            <p className="text-lg font-medium">Belum ada submission.</p>
          </div>
        )}
        {filtered.length > 0 && (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left p-4 font-bold text-sm text-white/70">Tim</th>
                <th className="text-left p-4 font-bold text-sm text-white/70">Kategori</th>
                <th className="text-left p-4 font-bold text-sm text-white/70 hidden md:table-cell">Judul</th>
                <th className="text-left p-4 font-bold text-sm text-white/70">Status</th>
                <th className="text-right p-4 font-bold text-sm text-white/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team) => {
                const sudahDinilai = !!team.penilaian?.[team.juriId];
                return (
                  <tr key={team.teamName} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{team.teamName}</td>
                    <td className="p-4 text-white/80 uppercase text-sm">{team.category}</td>
                    <td className="p-4 text-white/70 text-sm hidden md:table-cell truncate max-w-[200px]">
                      {team.abstrak?.title || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          sudahDinilai
                            ? "text-green-300 bg-green-500/20 border-green-400/30"
                            : "text-yellow-300 bg-yellow-500/20 border-yellow-400/30"
                        }`}
                      >
                        {sudahDinilai ? "Dinilai" : "Belum"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/score?team=${team.teamName}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/80 text-sm font-bold transition-all"
                      >
                        {sudahDinilai ? <Eye size={16} /> : <Star size={16} />}
                        {sudahDinilai ? "Lihat" : "Nilai"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
