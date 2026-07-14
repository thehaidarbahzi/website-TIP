"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, UserCog, X, Loader2 } from "lucide-react";
import type { User, UserRole } from "@/app/(utils)/types/user";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "juri", label: "Juri" },
  { value: "panitia", label: "Panitia" },
  { value: "admin", label: "Admin" },
];

const ROLE_STYLE: Record<UserRole, string> = {
  admin: "text-purple-300 bg-purple-500/20 border-purple-400/30",
  juri: "text-cyan-300 bg-cyan-500/20 border-cyan-400/30",
  panitia: "text-amber-300 bg-amber-500/20 border-amber-400/30",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "juri" as UserRole,
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { getUsers } = await import("@/app/lib/action/users");
      const data = await getUsers();
      setUsers(data);
    } catch {
      setErr("Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ name: "", email: "", password: "", role: "juri" });
    setEditing(null);
    setShowForm(false);
    setErr("");
  }

  function startEdit(u: User) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setShowForm(true);
    setErr("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setMsg("");

    try {
      const { createUser, updateUser } = await import("@/app/lib/action/users");

      if (editing) {
        const payload: {
          name?: string;
          email?: string;
          role?: UserRole;
          password?: string;
        } = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password.length > 0) payload.password = form.password;
        const res = await updateUser(editing.id, payload);
        if (res.ok) {
          setMsg(`User ${form.email} berhasil diupdate.`);
          resetForm();
          loadUsers();
        }
      } else {
        if (form.password.length < 6) {
          setErr("Password minimal 6 karakter.");
          setSubmitting(false);
          return;
        }
        const res = await createUser(form);
        if (res.ok) {
          setMsg(`User ${form.email} berhasil dibuat.`);
          resetForm();
          loadUsers();
        }
      }
      setTimeout(() => setMsg(""), 3000);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus user "${name}"?`)) return;
    try {
      const { deleteUser } = await import("@/app/lib/action/users");
      await deleteUser(id);
      setMsg(`User ${name} dihapus.`);
      loadUsers();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setErr("Gagal menghapus user.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Kelola User
        </h1>
        <button
          onClick={() => {
            if (showForm && editing) resetForm();
            else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Batal" : "Tambah"}
        </button>
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-white">
            {editing ? "Edit User" : "Tambah User Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Nama
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder="email@contoh.com"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Password{" "}
                {editing && (
                  <span className="text-white/50 font-normal">
                    (kosongkan jika tidak diubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                required={!editing}
                minLength={editing ? 0 : 6}
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
                placeholder={editing ? "••••••••" : "Min. 6 karakter"}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value as UserRole }))
                }
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value} className="text-slate-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editing ? "Simpan Perubahan" : "Simpan"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-bold rounded-[1rem] transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/50">
            <Loader2 size={48} className="mx-auto mb-4 text-white/30 animate-spin" />
            <p className="text-lg font-medium">Memuat data...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            <UserCog size={48} className="mx-auto mb-4 text-white/30" />
            <p className="text-lg font-medium">Belum ada user.</p>
          </div>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Nama
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Email
                </th>
                <th className="text-left p-4 font-bold text-sm text-white/70">
                  Role
                </th>
                <th className="text-right p-4 font-bold text-sm text-white/70">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-bold">{u.name}</td>
                  <td className="p-4 text-white/70">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${ROLE_STYLE[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(u)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-all"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
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
