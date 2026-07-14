"use client";

import { useEffect, useState } from "react";
import type { EventTimeline } from "@/app/(utils)/types/event";

export function useEventTimeline() {
  const [timeline, setTimeline] = useState<EventTimeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { getEventTimeline } = await import(
          "@/app/lib/action/events"
        );
        const data = await getEventTimeline();
        if (!cancelled) setTimeline(data);
      } catch (err) {
        console.error("Gagal memuat timeline event:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { timeline, loading };
}
