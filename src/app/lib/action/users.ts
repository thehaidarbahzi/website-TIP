"use server";

import bcrypt from "bcryptjs";
import { getFirebaseAdminDb } from "../server/firebase";
import { getSession } from "../server/auth/sessions";
import type { UserRole } from "@/app/(utils)/types/user";

async function requireAdmin() {
  const cookie = await getSession();
  if (!cookie) throw new Error("Unauthorized");
  const { decrypt } = await import("../server/auth/sessions");
  const session = await decrypt(cookie.value);
  if (!session || session.user_role !== "admin") throw new Error("Forbidden");
  return session;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const hash = bcrypt.hashSync(data.password, 10);
  const ref = db.ref("users").push();
  await ref.set({
    email: data.email,
    password: hash,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  });
  return { ok: true, id: ref.key };
}

export async function getUsers() {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("users").once("value");
  const data = snapshot.val() as Record<
    string,
    { email: string; password: string; name: string; role: string; createdAt: string }
  > | null;
  if (!data) return [];
  return Object.entries(data).map(([id, u]) => ({
    id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  }));
}

export async function updateUser(
  id: string,
  data: { email?: string; name?: string; role?: UserRole; password?: string },
) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const updates: Record<string, string> = {};

  if (data.email !== undefined) updates.email = data.email;
  if (data.name !== undefined) updates.name = data.name;
  if (data.role !== undefined) updates.role = data.role;
  if (data.password && data.password.length > 0) {
    updates.password = bcrypt.hashSync(data.password, 10);
  }

  if (Object.keys(updates).length === 0) return { ok: true };

  await db.ref(`users/${id}`).update(updates);
  return { ok: true };
}

export async function deleteUser(id: string) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  await db.ref(`users/${id}`).remove();
  return { ok: true };
}

export async function updateTeamStatus(
  teamName: string,
  status: "pending" | "verified" | "rejected",
) {
  const session = await requireAdmin();

  const db = getFirebaseAdminDb();
  await db.ref(`peserta/${teamName}/status`).set(status);
  await db.ref(`peserta/${teamName}/verifiedBy`).set(session.user_name);
  await db.ref(`peserta/${teamName}/verifiedAt`).set(new Date().toISOString());
  return { ok: true };
}

export async function getAllTeams() {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, Record<string, unknown>> | null;
  if (!data) return [];
  return Object.entries(data).map(([teamName, team]) => ({
    teamName,
    ...team,
  }));
}
