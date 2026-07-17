"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import { decrypt, getSession } from "../server/auth/sessions";

type FileMeta = {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileId?: string;
  webViewLink?: string;
};

export async function submitAbstrak(data: {
  teamName: string;
  subtema: string;
  title: string;
  file?: FileMeta;
  biodata?: FileMeta;
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
  if (!entry) return { ok: false, error: "Pendaftaran tidak ditemukan" };

  const [id] = entry;
  await db.ref(`peserta/${id}/abstrak`).set({
    subtema: data.subtema,
    title: data.title,
    file: data.file || null,
    biodata: data.biodata || null,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  });
  return { ok: true };
}
