"use client";

import { useState, useEffect } from "react";
import { useEventTimeline } from "./useEventTimeline";
import type { EventCategory } from "../types/event";

export function useTimeLock(
  category: string,
  stageKey: keyof EventCategory,
) {
  const { timeline, loading } = useEventTimeline();
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (loading || !timeline) return;

    const bypass = localStorage.getItem("debug_time_bypass");
    if (bypass === "1" || bypass === "2") {
      setIsLocked(false);
      return;
    }

    const cat = timeline[category as keyof typeof timeline];
    if (!cat) {
      setIsLocked(true);
      return;
    }

    const stage = cat[stageKey];
    if (!stage) {
      setIsLocked(true);
      return;
    }

    const now = Date.now();

    const toMs = (value?: number | string): number | undefined => {
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value === "number") return value;
      const parsed = new Date(value).getTime();
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const startMs = toMs(stage.start);
    const endMs = toMs(stage.end);
    const timeMs = toMs(stage.time);

    if (startMs !== undefined && endMs !== undefined) {
      setIsLocked(now < startMs || now > endMs);
    } else if (timeMs !== undefined) {
      setIsLocked(now < timeMs);
    } else {
      setIsLocked(true);
    }
  }, [timeline, loading, category, stageKey]);

  const lockMessage = getLockMessage(category, String(stageKey));

  return { isLocked: isLocked && !loading, lockMessage };
}

function getLockMessage(category: string, stageKey: string): string {
  if (category === "poster") {
    if (stageKey === "pengumpulan_poster")
      return "Pengumpulan Poster hanya dapat dilakukan pada masa yang ditentukan.";
    if (stageKey === "pengumpulan_poster_final")
      return "Pengumpulan Poster Final hanya dapat dilakukan pada masa final.";
  }
  if (stageKey === "pengumpulan_fullpaper")
    return "Pengumpulan Fullpaper hanya dapat dilakukan setelah pengumuman Abstrak.";
  if (stageKey === "final")
    return "Pengumpulan PPT hanya dapat dilakukan setelah pengumuman Finalis.";
  return "Masa pengumpulan belum dibuka atau sudah ditutup.";
}
