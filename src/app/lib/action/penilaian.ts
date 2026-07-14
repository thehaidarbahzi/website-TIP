"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import { getSessionUser } from "../server/auth/sessions";

export async function getTeamsWithSubmissions() {
  const session = await getSessionUser();
  if (!session || (session.user_role !== "admin" && session.user_role !== "juri")) {
    throw new Error("Forbidden");
  }

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, any> | null;
  if (!data) return [];

  return Object.entries(data)
    .filter(([, team]) => team.abstrak)
    .map(([teamName, team]) => ({
      teamName,
      category: team.category,
      institution: team.institution,
      leaderName: team.leaderName,
      abstrak: team.abstrak,
      penilaian: team.penilaian || {},
    }));
}

export async function submitScore(data: {
  teamName: string;
  skor: number;
  catatan: string;
}) {
  const session = await getSessionUser();
  if (!session || session.user_role !== "juri") {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getFirebaseAdminDb();
  await db.ref(`peserta/${data.teamName}/penilaian/${session.user_id}`).set({
    skor: data.skor,
    catatan: data.catatan,
    submittedAt: new Date().toISOString(),
    juriName: session.user_name,
  });
  return { ok: true };
}
