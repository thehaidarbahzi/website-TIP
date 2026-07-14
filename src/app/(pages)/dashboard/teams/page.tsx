"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const { getAllTeams } = await import("@/app/lib/action/users");
      const data = await getAllTeams();
      setTeams(data);
    }
    load();
  }, []);

  const filtered = teams.filter((t) => {
    const matchSearch =
      t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderEmail?.toLowerCase().includes(search.toLowerCase()) ||
      t.institution?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColor: Record<string, string> = {
    pending: "text-yellow-300 bg-yellow-500/20 border-yellow-400/30",
    verified: "text-green-300 bg-green-500/20 border-green-400/30",
    rejected: "text-red-300 bg-red-500/20 border-red-400/30",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Semua Tim
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
          <input
            type="text"
            placeholder="Cari tim, email, atau instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-[1rem] bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 px-4 rounded-[1rem] bg-white/10 border border-white/20 text-white backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
        >
          <option value="all" className="text-slate-900">Semua Status</option>
          <option value="pending" className="text-slate-900">Pending</option>
          <option value="verified" className="text-slate-900">Verified</option>
          <option value="rejected" className="text-slate-900">Rejected</option>
        </select>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left p-4 font-bold text-sm text-white/70">Tim</th>
                <th className="text-left p-4 font-bold text-sm text-white/70">Kategori</th>
                <th className="text-left p-4 font-bold text-sm text-white/70 hidden md:table-cell">Instansi</th>
                <th className="text-left p-4 font-bold text-sm text-white/70 hidden lg:table-cell">Email</th>
                <th className="text-left p-4 font-bold text-sm text-white/70">Status</th>
                <th className="text-right p-4 font-bold text-sm text-white/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Tidak ada data tim.
                  </td>
                </tr>
              )}
              {filtered.map((team) => (
                <tr key={team.teamName} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{team.teamName}</td>
                  <td className="p-4 text-white/80 uppercase text-sm">{team.category}</td>
                  <td className="p-4 text-white/70 hidden md:table-cell">{team.institution}</td>
                  <td className="p-4 text-white/70 text-sm hidden lg:table-cell">{team.leaderEmail}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColor[team.status] || "text-white/50"}`}>
                      {team.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/dashboard/teams/${team.teamName}`}
                      className="text-yellow-300 hover:text-yellow-100 font-bold text-sm transition-colors"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
