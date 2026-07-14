"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  Calendar,
  Info,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEventTimeline } from "@/app/(utils)/hooks/useEventTimeline";

function formatMs(ms: number): string {
  const d = new Date(ms);
  const day = d.getDate();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateRange(start?: number, end?: number): string {
  if (!start) return "";
  if (!end) return formatMs(start);
  return `${formatMs(start)} - ${formatMs(end)}`;
}

type UserData = {
  user_id: string;
  user_name: string;
  user_role: string;
  category?: string;
  team_status?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const { timeline } = useEventTimeline();

  useEffect(() => {
    async function load() {
      const { getCurrentUser } = await import("@/app/lib/action/auth");
      const session = await getCurrentUser();
      if (!session) return;
      setUser(session);
    }
    load();
  }, []);

  if (!user) {
    return (
      <div className="p-8 text-white/80">Memuat beranda...</div>
    );
  }

  if (user.user_role === "admin") return <AdminHome />;
  if (user.user_role === "juri") return <JuriHome />;
  return <GuestHome user={user} timeline={timeline} />;
}

function AdminHome() {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    lkti: 0,
    essay: 0,
    poster: 0,
  });

  useEffect(() => {
    async function load() {
      const { getAllTeams } = await import("@/app/lib/action/users");
      const teams = await getAllTeams();
      const s = {
        total: teams.length,
        verified: 0,
        pending: 0,
        rejected: 0,
        lkti: 0,
        essay: 0,
        poster: 0,
      };
      for (const t of teams) {
        if (t.status === "verified") s.verified++;
        else if (t.status === "rejected") s.rejected++;
        else s.pending++;
        if (t.category === "lkti") s.lkti++;
        else if (t.category === "essay") s.essay++;
        else if (t.category === "poster") s.poster++;
      }
      setStats(s);
    }
    load();
  }, []);

  const cards = [
    { label: "Total Tim", value: stats.total, icon: Users, color: "text-blue-300 bg-blue-500/20 border-blue-400/30" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-300 bg-yellow-500/20 border-yellow-400/30" },
    { label: "Verified", value: stats.verified, icon: CheckCircle, color: "text-green-300 bg-green-500/20 border-green-400/30" },
    { label: "Ditolak", value: stats.rejected, icon: XCircle, color: "text-red-300 bg-red-500/20 border-red-400/30" },
  ];

  const categoryCards = [
    { label: "LKTI", value: stats.lkti, color: "from-purple-400/20 to-pink-400/20" },
    { label: "Essay", value: stats.essay, color: "from-cyan-400/20 to-blue-400/20" },
    { label: "Poster", value: stats.poster, color: "from-orange-400/20 to-amber-400/20" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Overview Admin
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} backdrop-blur-xl border rounded-[1.5rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
          >
            <div className="flex items-center gap-3 mb-3">
              <card.icon size={24} />
              <p className="text-sm font-bold text-white/70">{card.label}</p>
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6`}
          >
            <p className="text-sm font-bold text-white/70 mb-2">{card.label}</p>
            <p className="text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard/teams"
          className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all"
        >
          <Users size={20} />
          Lihat Semua Tim
        </Link>
        <Link
          href="/dashboard/verifikasi"
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 text-yellow-300 font-bold rounded-[1rem] transition-all"
        >
          <CheckCircle size={20} />
          Verifikasi ({stats.pending})
        </Link>
      </div>
    </div>
  );
}

function JuriHome() {
  const [stats, setStats] = useState({ total: 0, scored: 0 });

  useEffect(() => {
    async function load() {
      const { getCurrentUser } = await import("@/app/lib/action/auth");
      const session = await getCurrentUser();
      if (!session) return;
      const { getTeamsWithSubmissions } = await import(
        "@/app/lib/action/penilaian"
      );
      const teams = await getTeamsWithSubmissions();
      const scored = teams.filter(
        (t: any) => t.penilaian?.[session.user_id],
      );
      setStats({ total: teams.length, scored: scored.length });
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Overview Juri
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={24} className="text-cyan-300" />
            <p className="text-sm font-bold text-white/70">Total Submissions</p>
          </div>
          <p className="text-3xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Star size={24} className="text-yellow-300" />
            <p className="text-sm font-bold text-white/70">Sudah Dinilai</p>
          </div>
          <p className="text-3xl font-black text-white">{stats.scored}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard/submissions"
          className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all"
        >
          <FileText size={20} />
          Lihat Submissions
        </Link>
        <Link
          href="/dashboard/score"
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 text-yellow-300 font-bold rounded-[1rem] transition-all"
        >
          <Star size={20} />
          Beri Nilai
        </Link>
      </div>
    </div>
  );
}

function GuestHome({
  user,
  timeline,
}: {
  user: UserData;
  timeline: ReturnType<typeof useEventTimeline>["timeline"];
}) {
  const category = user.category || "lkti";
  const cat = timeline?.[category as keyof typeof timeline];

  const now = Date.now();
  const bypass =
    typeof window !== "undefined"
      ? localStorage.getItem("debug_time_bypass")
      : null;

  function hasTimePassed(time?: number): boolean {
    if (bypass === "1" || bypass === "2") return true;
    if (!time) return false;
    return now >= time;
  }

  const abstrakAnnounce = cat?.pengumuman_abstrak?.time;
  const fullpaperAnnounce = cat?.pengumuman_fullpaper?.time;
  const isFullpaper = hasTimePassed(abstrakAnnounce);
  const isFinal = hasTimePassed(fullpaperAnnounce);
  const isPoster = category === "poster";
  const isVerified = user.team_status === "verified";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-entrance relative z-10">
      {/* Welcome Banner */}
      <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group hover:bg-white/15 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-yellow-300 font-bold mb-5 shadow-sm">
            Halo, Tim {user.user_name}!
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-400 pb-2">
            Selamat Datang di Dashboard
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl font-medium leading-relaxed drop-shadow-sm">
            Di sini Anda dapat mengelola tim, melihat pengumuman terbaru, dan
            mengumpulkan karya inovatif Anda.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute right-10 bottom-[-50px] w-40 h-40 bg-purple-400/30 rounded-full blur-[60px] pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Announcements */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-md flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.5)]" />
            Pengumuman Terbaru
          </h2>

          {!isVerified ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-start gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300 ${
                  user.team_status === "rejected"
                    ? "text-red-300"
                    : "text-yellow-300"
                }`}>
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-r mb-2 drop-shadow-sm pb-1 ${
                    user.team_status === "rejected"
                      ? "from-red-200 to-red-400"
                      : "from-yellow-200 to-amber-300"
                  }`}>
                    {user.team_status === "rejected"
                      ? "Tim Anda Ditolak"
                      : "Menunggu Verifikasi"}
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">
                    {user.team_status === "rejected"
                      ? "Tim Anda tidak lolos verifikasi. Silakan hubungi panitia untuk informasi lebih lanjut."
                      : "Tim Anda sedang menunggu verifikasi dari panitia. Anda belum dapat mengumpulkan karya saat ini."}
                  </p>
                </div>
              </div>
            </div>
          ) : isFinal && !isPoster ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:border-orange-400/50 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-orange-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300 mb-3 drop-shadow-sm pb-1">
                    Selamat, Anda Masuk Final!
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed mb-6">
                    Luar biasa! Tim Anda berhasil mencapai tahap akhir. Silakan
                    kumpulkan file presentasi (PPT) Anda.
                  </p>
                  <Link
                    href="/dashboard/ppt"
                    className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-base font-bold py-3.5 px-8 rounded-[1.2rem] shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all"
                  >
                    Kumpulkan PPT
                  </Link>
                </div>
              </div>
            </div>
          ) : isFullpaper && !isPoster ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 hover:border-green-400/50 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-green-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300 mb-3 drop-shadow-sm pb-1">
                    Selamat, Anda Lolos ke Tahap Berikutnya!
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed mb-6">
                    Tim Anda dinyatakan berhak melanjutkan ke tahap Fullpaper.
                    Kumpulkan sebelum tenggat waktu.
                  </p>
                  <Link
                    href="/dashboard/fullpaper"
                    className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-base font-bold py-3.5 px-8 rounded-[1.2rem] shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all"
                  >
                    Kumpulkan Fullpaper
                  </Link>
                </div>
              </div>
            </div>
          ) : isPoster ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-pink-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 mb-2 drop-shadow-sm pb-1">
                    Lomba Poster
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">
                    Kumpulkan karya poster Anda sesuai jadwal yang berlaku.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-blue-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Clock size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 mb-2 drop-shadow-sm pb-1">
                    Menunggu Pengumuman
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">
                    Saat ini kami masih berada pada tahap pengumpulan karya atau
                    penjurian. Pantau terus dashboard ini!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 text-purple-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Info size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200 mb-2 drop-shadow-sm pb-1">
                  {isVerified
                    ? "Tim Terverifikasi"
                    : user.team_status === "rejected"
                      ? "Tim Ditolak"
                      : "Menunggu Verifikasi"}
                </h3>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  {isVerified
                    ? "Akun tim Anda telah aktif dan terverifikasi."
                    : user.team_status === "rejected"
                      ? "Akun tim Anda tidak lolos verifikasi."
                      : "Akun tim Anda sedang dalam proses verifikasi."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300 drop-shadow-md flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.5)]" />
            Tenggat Waktu
          </h2>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-6 hover:bg-white/15 transition-all duration-300">
            {cat &&
              Object.entries(cat)
                .filter(([, stage]) => stage.start || stage.end || stage.time)
                .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
                .map(([key, stage], idx, arr) => {
                  const colors = [
                    { text: "text-orange-300", grad: "from-orange-200 to-orange-400" },
                    { text: "text-green-300", grad: "from-green-200 to-green-400" },
                    { text: "text-purple-300", grad: "from-purple-200 to-purple-400" },
                    { text: "text-pink-300", grad: "from-pink-200 to-pink-400" },
                    { text: "text-cyan-300", grad: "from-cyan-200 to-cyan-400" },
                    { text: "text-yellow-300", grad: "from-yellow-200 to-yellow-400" },
                  ];
                  const c = colors[idx % colors.length];
                  const isLast = idx === arr.length - 1;

                  return (
                    <div key={key}>
                      <div className="flex gap-5 items-center group">
                        <div
                          className={`w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 ${c.text} rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Calendar size={28} />
                        </div>
                        <div>
                          <p
                            className={`text-base font-black text-transparent bg-clip-text bg-gradient-to-r ${c.grad} drop-shadow-sm`}
                          >
                            {stage.label || key}
                          </p>
                          <p className={`text-sm ${c.text} font-bold mt-1`}>
                            {stage.start || stage.end
                              ? formatDateRange(stage.start, stage.end)
                              : stage.time
                                ? formatMs(stage.time)
                                : ""}
                          </p>
                        </div>
                      </div>
                      {!isLast && <div className="h-px bg-white/20 w-full my-6" />}
                    </div>
                  );
                })}
            {cat &&
              Object.entries(cat).filter(
                ([, s]) => s.start || s.end || s.time,
              ).length === 0 && (
                <p className="text-white/50 text-sm font-medium text-center py-4">
                  Belum ada jadwal yang ditentukan.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
