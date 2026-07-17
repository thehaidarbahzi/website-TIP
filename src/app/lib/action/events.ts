"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import type { EventTimeline, EventCategory, EventStage } from "@/app/(utils)/types/event";

export async function getEventTimeline(): Promise<EventTimeline> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("event").once("value");
  let data = snapshot.val() as Record<string, Record<string, any>> | null;

  if (!data) {
    try {
      const fs = require("fs");
      const path = require("path");
      const eJsonPath = path.join(process.cwd(), "e.json");
      if (fs.existsSync(eJsonPath)) {
        const fileContent = fs.readFileSync(eJsonPath, "utf-8");
        const parsed = JSON.parse(fileContent);
        data = parsed.event || null;
      }
    } catch (e) {
      console.warn("Failed to load fallback e.json", e);
    }
  }

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

  const isInRange = (stage: EventStage): boolean => {
    if (stage.start !== undefined && stage.end !== undefined) {
      return now >= stage.start && now <= stage.end;
    }
    if (stage.time !== undefined) {
      return now >= stage.time;
    }
    return false;
  };

  const hasPassed = (stage: EventStage): boolean => {
    if (stage.end !== undefined) return now > stage.end;
    if (stage.time !== undefined) return now > stage.time;
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
