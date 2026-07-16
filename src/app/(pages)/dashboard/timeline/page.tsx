"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Save,
  GripVertical,
} from "lucide-react";
import type { EventCategory, EventStage } from "@/app/(utils)/types/event";

type Track = "lkti" | "essay" | "poster";

const TRACKS: { id: Track; label: string }[] = [
  { id: "lkti", label: "LKTI" },
  { id: "essay", label: "ESSAY" },
  { id: "poster", label: "POSTER" },
];

const EMPTY_STAGE: EventStage = {
  label: "",
  order: undefined,
  startsAt: "",
  endsAt: "",
  time: "",
  countdownTitle: "",
};

function toDateTimeLocal(iso?: string | number): string {
  if (!iso && iso !== 0) return "";
  const str = typeof iso === "number" ? new Date(iso).toISOString() : iso;
  return str.slice(0, 16);
}

function fromDateTimeLocal(value: string): string {
  if (!value) return "";
  return `${value}:00+07:00`;
}

function formatDateTime(iso?: string | number): string {
  if (!iso && iso !== 0) return "-";
  const str = typeof iso === "number" ? new Date(iso).toISOString() : iso;
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return String(iso);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminTimelinePage() {
  const [timeline, setTimeline] = useState<Record<Track, EventCategory>>({
    lkti: {},
    essay: {},
    poster: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<Track>("lkti");
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState<EventStage>({ ...EMPTY_STAGE });
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    setLoading(true);
    try {
      const { getEventTimeline } = await import("@/app/lib/action/events");
      const data = await getEventTimeline();
      setTimeline({
        lkti: data.lkti ?? {},
        essay: data.essay ?? {},
        poster: data.poster ?? {},
      });
    } catch {
      setErr("Gagal memuat timeline.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ ...EMPTY_STAGE });
    setEditingKey(null);
    setShowForm(false);
    setErr("");
  }

  function startAdd() {
    setForm({ ...EMPTY_STAGE });
    setEditingKey(null);
    setShowForm(true);
    setErr("");
  }

  function startEdit(key: string, stage: EventStage) {
    setForm({
      label: stage.label ?? "",
      order: stage.order,
      startsAt: toDateTimeLocal(stage.startsAt),
      endsAt: toDateTimeLocal(stage.endsAt),
      time: toDateTimeLocal(stage.time),
      countdownTitle: stage.countdownTitle ?? "",
    });
    setEditingKey(key);
    setShowForm(true);
    setErr("");
  }

  async function handleSaveAll() {
    setSaving(true);
    setErr("");
    setMsg("");
    try {
      const { updateEventTimeline } = await import("@/app/lib/action/events");
      await updateEventTimeline(timeline as EventCategory extends infer C
        ? Record<Track, C>
        : never);
      setMsg("Timeline berhasil disimpan.");
      setTimeout(() => setMsg(""), 3000);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan timeline.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitStage(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setMsg("");

    try {
      const key = editingKey || `stage_${Date.now()}`;
      const stagePayload: EventStage = {
        label: form.label || key,
        order: form.order,
        startsAt: fromDateTimeLocal(form.startsAt ?? ""),
        endsAt: fromDateTimeLocal(form.endsAt ?? ""),
        time: fromDateTimeLocal((form.time as string | undefined) ?? ""),
        countdownTitle: form.countdownTitle || undefined,
      };

      if (editingKey) {
        setTimeline((prev) => ({
          ...prev,
          [activeTrack]: {
            ...prev[activeTrack],
            [editingKey]: stagePayload,
          },
        }));
      } else {
        setTimeline((prev) => ({
          ...prev,
          [activeTrack]: {
            ...prev[activeTrack],
            [key]: stagePayload,
          },
        }));
      }

      const { addStage } = await import("@/app/lib/action/events");
      await addStage(activeTrack, key, stagePayload);

      setMsg(editingKey ? "Stage berhasil diupdate." : "Stage berhasil ditambahkan.");
      resetForm();
      loadTimeline();
      setTimeout(() => setMsg(""), 3000);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(key: string, label: string) {
    if (!confirm(`Hapus stage "${label}"?`)) return;
    try {
      const { deleteStage } = await import("@/app/lib/action/events");
      await deleteStage(activeTrack, key);
      setTimeline((prev) => {
        const next = { ...prev[activeTrack] };
        delete next[key];
        return { ...prev, [activeTrack]: next };
      });
      setMsg(`Stage "${label}" dihapus.`);
      loadTimeline();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setErr("Gagal menghapus stage.");
    }
  }

  const currentCategory = timeline[activeTrack];
  const sortedStages = Object.entries(currentCategory).sort(
    ([, a], [, b]) => (a.order ?? 999) - (b.order ?? 999),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Kelola Timeline
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <Save size={18} />
            Simpan Semua
          </button>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all"
          >
            <Plus size={18} />
            Tambah Stage
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-green-500/20 text-green-100 border border-green-400/30 p-4 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-500/20 text-red-100 border border-red-400/30 p-4 rounded-xl text-sm font-medium">
          {err}
        </div>
      )}

      <div className="flex gap-2 bg-white/10 p-1.5 rounded-[1.2rem] w-fit border border-white/20 backdrop-blur-xl">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            className={`px-5 py-2 rounded-[1rem] font-bold text-sm transition-all ${
              activeTrack === track.id
                ? "bg-white/20 text-yellow-300 shadow-inner border border-white/30"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmitStage}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-white">
            {editingKey ? "Edit Stage" : "Tambah Stage Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Stage Key (ID)
              </label>
              <input
                type="text"
                required
                disabled={!!editingKey}
                value={editingKey || form.label}
                onChange={(e) =>
                  setForm((p) => ({ ...p, label: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
                placeholder="contoh: pendaftaran"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Label
              </label>
              <input
                type="text"
                value={form.label}
                onChange={(e) =>
                  setForm((p) => ({ ...p, label: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder="Pendaftaran"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Order
              </label>
              <input
                type="number"
                value={form.order ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    order: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder="1"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Countdown Title
              </label>
              <input
                type="text"
                value={form.countdownTitle ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, countdownTitle: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder="Pendaftaran Dibuka Dalam"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Starts At
              </label>
              <input
                type="datetime-local"
                value={form.startsAt ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startsAt: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Ends At
              </label>
              <input
                type="datetime-local"
                value={form.endsAt ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endsAt: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-white mb-1 block">
                Time
              </label>
              <input
                type="datetime-local"
                value={form.time ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editingKey ? "Simpan Perubahan" : "Tambah"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-bold rounded-[1rem] transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/50">
            <Loader2 size={48} className="mx-auto mb-4 text-white/30 animate-spin" />
            <p className="text-lg font-medium">Memuat data...</p>
          </div>
        ) : sortedStages.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            <GripVertical size={48} className="mx-auto mb-4 text-white/30" />
            <p className="text-lg font-medium">Belum ada stage untuk kategori ini.</p>
          </div>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left p-4 font-bold text-sm text-white/70 w-12">
                  #
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Key
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Label
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Order
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Waktu
                </th>
                <th className="text-right p-4 font-bold text-sm text-white/70">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStages.map(([key, stage], idx) => (
                <tr
                  key={key}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-bold text-white/50">{idx + 1}</td>
                  <td className="p-4 font-mono text-sm text-white/70">{key}</td>
                  <td className="p-4 font-bold">{stage.label ?? key}</td>
                  <td className="p-4 text-white/70">{stage.order ?? "-"}</td>
                  <td className="p-4 text-white/70 text-xs">
                    {stage.startsAt || stage.endsAt ? (
                      <span>
                        {formatDateTime(stage.startsAt)} &rarr; {formatDateTime(stage.endsAt)}
                      </span>
                    ) : stage.time ? (
                      <span>{formatDateTime(stage.time)}</span>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(key, stage)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-all"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(key, stage.label ?? key)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
