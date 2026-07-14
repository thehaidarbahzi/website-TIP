"use server";

import { getFirebaseAdminDb } from "../server/firebase";

export async function getTeamByName(teamName: string) {
  try {
    if (!teamName.trim()) {
      return { ok: false, error: "Missing teamName" };
    }

    const db = getFirebaseAdminDb();
    const snapshot = await db.ref("peserta").once("value");
    const data = snapshot.val() as Record<string, { teamName?: string }> | null;

    if (!data) {
      return { ok: false, error: "No peserta found" };
    }

    const target = Object.entries(data).find(
      ([, value]) =>
        (value?.teamName || "").trim().toLowerCase() ===
        teamName.trim().toLowerCase(),
    );

    if (!target) {
      return { ok: false, error: "Registration not found for this teamName" };
    }

    const [id, value] = target;
    return { ok: true, id, registration: { ...value, id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
