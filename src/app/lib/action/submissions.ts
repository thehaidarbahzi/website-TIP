"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import { decrypt, getSession } from "../server/auth/sessions";

export async function submitFullpaper(data: {
  teamName: string;
  subtema: string;
  title: string;
  file?: { fileName: string; fileSize: number; fileId: string; webViewLink: string; fileType: string };
  orisinalitas?: { fileName: string; fileSize: number; fileId: string; webViewLink: string; fileType: string };
}) {
  const sessionCookie = await getSession();
  if (!sessionCookie) return { ok: false, error: "Unauthorized" };
  const session = await decrypt(sessionCookie.value);
  if (!session || session.user_name !== data.teamName) return { ok: false, error: "Session mismatch" };

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const allData = snapshot.val() as Record<string, any> | null;
  const entry = Object.entries(allData || {}).find(
    ([, v]) => (v?.teamName || "").trim().toLowerCase() === data.teamName.trim().toLowerCase(),
  );
  if (!entry) return { ok: false, error: "Tim tidak ditemukan" };

  const [id] = entry;
  await db.ref(`peserta/${id}/fullpaper`).set({
    subtema: data.subtema,
    title: data.title,
    file: data.file || null,
    orisinalitas: data.orisinalitas || null,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  });
  return { ok: true };
}

export async function submitPoster(data: {
  teamName: string;
  subtema: string;
  title: string;
  file?: { fileName: string; fileSize: number; fileId: string; webViewLink: string; fileType: string };
}) {
  const sessionCookie = await getSession();
  if (!sessionCookie) return { ok: false, error: "Unauthorized" };
  const session = await decrypt(sessionCookie.value);
  if (!session || session.user_name !== data.teamName) return { ok: false, error: "Session mismatch" };

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const allData = snapshot.val() as Record<string, any> | null;
  const entry = Object.entries(allData || {}).find(
    ([, v]) => (v?.teamName || "").trim().toLowerCase() === data.teamName.trim().toLowerCase(),
  );
  if (!entry) return { ok: false, error: "Tim tidak ditemukan" };

  const [id] = entry;
  await db.ref(`peserta/${id}/poster`).set({
    subtema: data.subtema,
    title: data.title,
    file: data.file || null,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  });
  return { ok: true };
}

export async function submitPPT(data: {
  teamName: string;
  link?: string;
  file?: { fileName: string; fileSize: number; fileId: string; webViewLink: string; fileType: string };
}) {
  const sessionCookie = await getSession();
  if (!sessionCookie) return { ok: false, error: "Unauthorized" };
  const session = await decrypt(sessionCookie.value);
  if (!session || session.user_name !== data.teamName) return { ok: false, error: "Session mismatch" };

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const allData = snapshot.val() as Record<string, any> | null;
  const entry = Object.entries(allData || {}).find(
    ([, v]) => (v?.teamName || "").trim().toLowerCase() === data.teamName.trim().toLowerCase(),
  );
  if (!entry) return { ok: false, error: "Tim tidak ditemukan" };

  const [id] = entry;
  await db.ref(`peserta/${id}/ppt`).set({
    link: data.link || null,
    file: data.file || null,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  });
  return { ok: true };
}
