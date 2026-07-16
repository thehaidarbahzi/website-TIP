"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import { getSession } from "../server/auth/sessions";
import type { EventTimeline, EventCategory, EventStage } from "@/app/(utils)/types/event";

async function requireAdmin() {
  const cookie = await getSession();
  if (!cookie) throw new Error("Unauthorized");
  const { decrypt } = await import("../server/auth/sessions");
  const session = await decrypt(cookie.value);
  if (!session || session.user_role !== "admin") throw new Error("Forbidden");
  return session;
}

export async function getEventTimeline(): Promise<EventTimeline> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("event").once("value");
  const data = snapshot.val() as Record<string, Record<string, EventStage>> | null;

  if (!data) return {};

  const timeline: EventTimeline = {};

  for (const [category, stages] of Object.entries(data)) {
    if (!["lkti", "essay", "poster"].includes(category)) continue;
    const cat: EventCategory = {};
    for (const [stageKey, stageData] of Object.entries(stages)) {
      if (typeof stageData === "object" && stageData !== null) {
        cat[stageKey] = {
          start: stageData.start ?? undefined,
          end: stageData.end ?? undefined,
          time: stageData.time ?? undefined,
          label: stageData.label ?? stageKey,
          order: stageData.order ?? undefined,
          startsAt: stageData.startsAt ?? undefined,
          endsAt: stageData.endsAt ?? undefined,
          countdownTitle: stageData.countdownTitle ?? undefined,
        };
      }
    }
    timeline[category as keyof EventTimeline] = cat;
  }

  return timeline;
}

export async function getCurrentStage(
  category: string,
): Promise<string> {
  const timeline = await getEventTimeline();
  const cat = timeline[category as keyof EventTimeline];
  if (!cat) return "administrasi";

  const now = Date.now();

  const toMs = (value?: number | string): number | undefined => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "number") return value;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const isInRange = (stage: EventStage): boolean => {
    const start = toMs(stage.start);
    const end = toMs(stage.end);
    if (start !== undefined && end !== undefined) {
      return now >= start && now <= end;
    }
    const time = toMs(stage.time);
    if (time !== undefined) {
      return now >= time;
    }
    return false;
  };

  const hasPassed = (stage: EventStage): boolean => {
    const end = toMs(stage.end);
    if (end !== undefined) return now > end;
    const time = toMs(stage.time);
    if (time !== undefined) return now > time;
    return false;
  };

  const posterFinalStages = [
    "pengumpulan_poster_final",
    "pengumuman_poster_final",
  ];
  const lktiEssayFinalStages = ["final"];
  const penyisihanStages = [
    "pengumpulan_fullpaper",
    "pengumuman_fullpaper",
    "seleksi_abstrak",
    "pengumuman_abstrak",
  ];

  for (const stageKey of Object.keys(cat)) {
    if (isInRange(cat[stageKey])) {
      if (
        category === "poster" &&
        posterFinalStages.some((s) => stageKey.includes(s))
      ) {
        return "final";
      }
      if (
        category !== "poster" &&
        lktiEssayFinalStages.some((s) => stageKey.includes(s))
      ) {
        return "final";
      }
      if (
        category !== "poster" &&
        penyisihanStages.some((s) => stageKey.includes(s))
      ) {
        return "penyisihan";
      }
      if (stageKey.includes("pendaftaran")) return "administrasi";
    }
  }

  if (category === "poster") {
    const posterFinal = cat["pengumpulan_poster_final"];
    if (posterFinal && hasPassed(posterFinal)) return "final";
    const poster = cat["pengumpulan_poster"];
    if (poster && hasPassed(poster)) return "penyisihan";
  } else {
    const final = cat["final"];
    if (final && hasPassed(final)) return "final";
    const fullpaper = cat["pengumpulan_fullpaper"];
    if (fullpaper && hasPassed(fullpaper)) return "penyisihan";
  }

  return "administrasi";
}

export async function updateEventTimeline(
  timeline: EventTimeline,
): Promise<{ ok: true }> {
  await requireAdmin();

  const db = getFirebaseAdminDb();

  const payload: Record<string, Record<string, Partial<EventStage>>> = {};
  for (const [category, stages] of Object.entries(timeline)) {
    if (!["lkti", "essay", "poster"].includes(category)) continue;
    const cat: Record<string, Partial<EventStage>> = {};
    const catStages = stages as EventCategory;
    for (const [stageKey, stageData] of Object.entries(catStages)) {
      const stage: EventStage = stageData as EventStage;
      const obj: Partial<EventStage> = {};
      if (stage.label !== undefined) obj.label = stage.label;
      if (stage.order !== undefined) obj.order = stage.order;
      if (stage.start !== undefined) obj.start = stage.start;
      if (stage.end !== undefined) obj.end = stage.end;
      if (stage.time !== undefined) obj.time = stage.time;
      if (stage.startsAt !== undefined) obj.startsAt = stage.startsAt;
      if (stage.endsAt !== undefined) obj.endsAt = stage.endsAt;
      if (stage.countdownTitle !== undefined)
        obj.countdownTitle = stage.countdownTitle;
      cat[stageKey] = obj;
    }
    payload[category] = cat;
  }

  await db.ref("event").set(payload);
  return { ok: true };
}

export async function deleteStage(
  category: string,
  stageKey: string,
): Promise<{ ok: true }> {
  await requireAdmin();

  if (!["lkti", "essay", "poster"].includes(category)) {
    throw new Error("Kategori tidak valid.");
  }

  const db = getFirebaseAdminDb();
  await db.ref(`event/${category}/${stageKey}`).remove();
  return { ok: true };
}

export async function addStage(
  category: string,
  stageKey: string,
  stage: EventStage,
): Promise<{ ok: true }> {
  await requireAdmin();

  if (!["lkti", "essay", "poster"].includes(category)) {
    throw new Error("Kategori tidak valid.");
  }

  const db = getFirebaseAdminDb();
  const obj: Partial<EventStage> = {};
  if (stage.label !== undefined) obj.label = stage.label;
  if (stage.order !== undefined) obj.order = stage.order;
  if (stage.start !== undefined) obj.start = stage.start;
  if (stage.end !== undefined) obj.end = stage.end;
  if (stage.time !== undefined) obj.time = stage.time;
  if (stage.startsAt !== undefined) obj.startsAt = stage.startsAt;
  if (stage.endsAt !== undefined) obj.endsAt = stage.endsAt;
  if (stage.countdownTitle !== undefined)
    obj.countdownTitle = stage.countdownTitle;

  await db.ref(`event/${category}/${stageKey}`).set(obj);
  return { ok: true };
}
