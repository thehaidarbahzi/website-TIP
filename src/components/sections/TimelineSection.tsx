"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useEventTimeline } from "@/app/(utils)/hooks/useEventTimeline";
import type { EventCategory, EventTimeline } from "@/app/(utils)/types/event";
import "./TimelineSection.css";

type TimelineTrack = "lkti" | "essay" | "poster";

type TimelineStageWithDates = {
  label: string;
  order?: number;
  startsAt?: string;
  endsAt?: string;
  countdownTitle?: string;
  start?: number;
  end?: number;
  time?: number;
};

type TimelineItem = {
  id: string;
  label: string;
  active: boolean;
  completed: boolean;
  timeValue?: number;
  startValue?: number;
  endValue?: number;
  hasRange: boolean;
};

type CountdownState = {
  title: string;
  targetDate: string | null;
  completed: boolean;
};

const TRACKS: {
  id: TimelineTrack;
  label: string;
}[] = [
  {
    id: "lkti",
    label: "LKTI",
  },
  {
    id: "essay",
    label: "ESSAY",
  },
  {
    id: "poster",
    label: "POSTER",
  },
];

const REGISTRATION_DEFAULTS: Record<
  TimelineTrack,
  { start: string; end: string }
> = {
  lkti: {
    start: "2026-07-21T00:00:00+07:00",
    end: "2026-09-08T23:59:00+07:00",
  },
  essay: {
    start: "2026-07-21T00:00:00+07:00",
    end: "2026-09-08T23:59:00+07:00",
  },
  poster: {
    start: "2026-07-21T00:00:00+07:00",
    end: "2026-08-19T23:59:00+07:00",
  },
};

function parseTime(value?: string | number) {
  if (value === undefined || value === null) return null;

  if (typeof value === "number") {
    const time = value > 9_999_999_999 ? value : value * 1000;
    return Number.isFinite(time) ? time : null;
  }

  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const time =
      numeric > 9_999_999_999 ? numeric : numeric * 1000;
    return Number.isFinite(time) ? time : null;
  }

  const time = new Date(trimmed).getTime();
  return Number.isFinite(time) ? time : null;
}

const WIB_DATE_KEY_FORMATTER = new Intl.DateTimeFormat(
  "en-CA",
  {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
);

function getWibDateKey(value: number) {
  return WIB_DATE_KEY_FORMATTER.format(new Date(value));
}

const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const TIME_ONLY_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
});

const MOBILE_DATE_FORMATTER = new Intl.DateTimeFormat(
  "id-ID",
  {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
  },
);

function formatTimestamp(value: number): string {
  return TIMESTAMP_FORMATTER.format(new Date(value));
}

function formatTimeOnly(value: number): string {
  return TIME_ONLY_FORMATTER.format(new Date(value));
}

function formatTimelineTooltip(item: TimelineItem): string | null {
  const hasInterval =
    item.startValue !== undefined && item.endValue !== undefined;

  if (hasInterval) {
    const sameDay =
      getWibDateKey(item.startValue!) ===
      getWibDateKey(item.endValue!);

    const startText = formatTimestamp(item.startValue!);
    const endText = sameDay
      ? formatTimeOnly(item.endValue!)
      : formatTimestamp(item.endValue!);

    return `${startText} – ${endText}`;
  }

  if (item.timeValue !== undefined) {
    return formatTimestamp(item.timeValue);
  }

  if (item.startValue !== undefined) {
    return formatTimestamp(item.startValue);
  }

  return null;
}

function formatTimelineDateShort(
  item: TimelineItem,
): string | null {
  if (
    item.startValue !== undefined &&
    item.endValue !== undefined
  ) {
    const startText = MOBILE_DATE_FORMATTER.format(
      new Date(item.startValue),
    );

    const endText = MOBILE_DATE_FORMATTER.format(
      new Date(item.endValue),
    );

    return `${startText} – ${endText}`;
  }

  const timestamp =
    item.timeValue ?? item.startValue;

  if (timestamp === undefined) {
    return null;
  }

  return MOBILE_DATE_FORMATTER.format(
    new Date(timestamp),
  );
}


function getRemainingTime(targetDate: string | null) {
  if (!targetDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const targetTime = parseTime(targetDate);

  if (targetTime === null) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const distance = Math.max(targetTime - Date.now(), 0);

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function useCountdown(targetDate: string | null) {
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(targetDate),
  );

  useEffect(() => {
    const updateCountdown = () => {
      setRemaining(getRemainingTime(targetDate));
    };

    updateCountdown();

    if (!targetDate) return;

    const intervalId = window.setInterval(
      updateCountdown,
      1000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetDate]);

  return remaining;
}

function getSortedStages(
  category: EventCategory | undefined,
) {
  if (!category) return [];

  return Object.entries(category)
    .map(([id, rawStage]) => ({
      id,
      ...(rawStage as TimelineStageWithDates),
    }))
    .sort(
      (stageA, stageB) =>
        (stageA.order ?? 999) -
        (stageB.order ?? 999),
    );
}

function resolveCountdownState(
  track: TimelineTrack,
  category: EventCategory | undefined,
): CountdownState {
  const now = Date.now();
  const defaults = REGISTRATION_DEFAULTS[track];

  const regStart = parseTime(defaults.start);
  const regEnd = parseTime(defaults.end);

  if (!category) {
    if (regStart === null || regEnd === null) {
      return {
        title: "Timeline",
        targetDate: null,
        completed: false,
      };
    }

    if (now < regStart) {
      return {
        title: "Pendaftaran Dibuka Dalam",
        targetDate: defaults.start,
        completed: false,
      };
    }

    if (now < regEnd) {
      return {
        title: "Pendaftaran Ditutup Dalam",
        targetDate: defaults.end,
        completed: false,
      };
    }

    return {
      title: "Pendaftaran Telah Ditutup",
      targetDate: null,
      completed: true,
    };
  }

  const stages = getSortedStages(category);

  const activeStage = stages.find((stage) => {
    const start = parseTime(stage.startsAt ?? stage.start);
    const end = parseTime(stage.endsAt ?? stage.end);

    if (start !== null && end !== null) {
      return now >= start && now < end;
    }

    return false;
  });

  if (activeStage) {
    const end = parseTime(activeStage.endsAt ?? activeStage.end);
    if (end !== null) {
      return {
        title: activeStage.countdownTitle ?? "Sisa Waktu",
        targetDate: String(end),
        completed: false,
      };
    }
  }

  const upcomingStage = stages.find((stage) => {
    const start = parseTime(stage.startsAt ?? stage.start);
    const singleTime = parseTime(stage.time);

    if (start !== null) {
      return now < start;
    }

    if (singleTime !== null) {
      return now < singleTime;
    }

    return false;
  });

  if (upcomingStage) {
    const start = parseTime(
      upcomingStage.startsAt ?? upcomingStage.start,
    );
    const singleTime = parseTime(upcomingStage.time);
    const target = start ?? singleTime;

    if (target !== null) {
      return {
        title: upcomingStage.countdownTitle ?? "Dimulai Dalam",
        targetDate: String(target),
        completed: false,
      };
    }
  }

  return {
    title: "Kompetisi telah selesai",
    targetDate: null,
    completed: true,
  };
}

function categoryToTimelineItems(
  category: EventCategory | undefined,
): TimelineItem[] {
  const stages = getSortedStages(category);
  const now = Date.now();

  return stages.map((stage) => {
    const singleTime = parseTime(stage.time);
    const startTime = parseTime(
      stage.startsAt ?? stage.start,
    );
    const endTime = parseTime(
      stage.endsAt ?? stage.end,
    );

    const hasRange =
      startTime !== null && endTime !== null;

    const isActiveRange =
      hasRange &&
      now >= startTime &&
      now < endTime;

    const isCompletedRange =
      hasRange &&
      now > endTime;

    const isCompletedSingle =
      singleTime !== null &&
      now > singleTime;

    return {
      id: stage.id,
      label: stage.label,
      active: isActiveRange,
      completed: isCompletedRange || isCompletedSingle,
      timeValue: singleTime ?? undefined,
      startValue: startTime ?? undefined,
      endValue: endTime ?? undefined,
      hasRange,
    };
  });
}

function getDigitClass(value: number) {
  const digitCount = String(Math.abs(value)).length;

  if (digitCount >= 4) {
    return "timeline-section__countdown-value--four-digits";
  }

  if (digitCount === 3) {
    return "timeline-section__countdown-value--three-digits";
  }

  if (digitCount === 2) {
    return "timeline-section__countdown-value--two-digits";
  }

  return "timeline-section__countdown-value--one-digit";
}

export default function TimelineSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { timeline, loading } = useEventTimeline();

  const [selectedTrack, setSelectedTrack] =
    useState<TimelineTrack>("lkti");

  const selectedTrackLabel = useMemo(
    () =>
      TRACKS.find((t) => t.id === selectedTrack)?.label ??
      selectedTrack.toUpperCase(),
    [selectedTrack],
  );

  const selectedCategory = useMemo(() => {
    if (!timeline) return undefined;

    return timeline[selectedTrack as keyof typeof timeline] as
      | EventCategory
      | undefined;
  }, [timeline, selectedTrack]);

  const countdownState = useMemo(
    () => resolveCountdownState(selectedTrack, selectedCategory),
    [selectedTrack, selectedCategory],
  );

  const timelineItems = useMemo(
    () => categoryToTimelineItems(selectedCategory),
    [selectedCategory],
  );

  const remaining = useCountdown(
    countdownState.targetDate,
  );

  const countdownItems = [
    {
      id: "days",
      value: remaining.days,
      label: "Hari",
    },
    {
      id: "hours",
      value: remaining.hours,
      label: "Jam",
    },
    {
      id: "minutes",
      value: remaining.minutes,
      label: "Menit",
    },
    {
      id: "seconds",
      value: remaining.seconds,
      label: "Detik",
    },
  ];

  const selectedTrackIndex = TRACKS.findIndex(
    (track) => track.id === selectedTrack,
  );

  function selectTrackByOffset(offset: number) {
    const nextIndex =
      (selectedTrackIndex + offset + TRACKS.length) %
      TRACKS.length;

    setSelectedTrack(TRACKS[nextIndex].id);
  }

  function selectPreviousTrack() {
    selectTrackByOffset(-1);
  }

  function selectNextTrack() {
    selectTrackByOffset(1);
  }

  function handleCategoryKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectPreviousTrack();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectNextTrack();
    }
  }

  return (
    <section
      className="timeline-section"
      aria-label="Countdown dan timeline acara"
    >
      <div className="timeline-section__canvas">
        <div className="timeline-section__pattern" aria-hidden="true" />

        <img
          className="timeline-section__shapes"
          src="/timeline-shapes.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div className="timeline-section__content">
          <div
            className="timeline-section__category-switcher"
            onKeyDown={handleCategoryKeyDown}
          >
            <button
              type="button"
              className="timeline-section__category-arrow timeline-section__category-arrow--previous"
              aria-label="Kategori sebelumnya"
              onClick={selectPreviousTrack}
            >
              <span aria-hidden="true" />
            </button>

            <div
              className="timeline-section__category-copy"
              key={selectedTrack}
            >
              <h2
                className="timeline-section__category-name"
                aria-live="polite"
              >
                {selectedTrackLabel}
              </h2>

              <p className="timeline-section__countdown-title">
                {countdownState.title}
              </p>
            </div>

            <button
              type="button"
              className="timeline-section__category-arrow timeline-section__category-arrow--next"
              aria-label="Kategori berikutnya"
              onClick={selectNextTrack}
            >
              <span aria-hidden="true" />
            </button>
          </div>

        <div
          className="timeline-section__countdown"
          key={`countdown-${selectedTrack}`}
        >
          {countdownItems.map((item) => (
            <div
              className="timeline-section__countdown-item"
              key={item.id}
            >
              <svg
                className="timeline-section__countdown-card"
                viewBox="0 0 120 154"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id={`countdown-inner-shadow-${item.id}`}
                    x="0"
                    y="0"
                    width="120"
                    height="154"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    />

                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />

                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />

                    <feOffset dy="4" />

                    <feGaussianBlur stdDeviation="2" />

                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />

                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />

                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="innerShadow"
                    />
                  </filter>
                </defs>

                <rect
                  width="120"
                  height="150"
                  rx="10"
                  fill="#8D1CC9"
                  filter={`url(#countdown-inner-shadow-${item.id})`}
                />
              </svg>

              <span
                className={[
                  "timeline-section__countdown-value",
                  getDigitClass(item.value),
                ].join(" ")}
              >
                {mounted ? item.value : 0}
              </span>

              <span className="timeline-section__countdown-label">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="timeline-section__timeline-area"
          key={`timeline-${selectedTrack}`}
        >
          {loading ? (
            <p className="timeline-section__status">
              Memuat timeline...
            </p>
          ) : timelineItems.length === 0 ? (
            <p className="timeline-section__status">
              Belum ada timeline untuk kategori ini.
            </p>
          ) : (
            <ol
              className="timeline-section__timeline"
              aria-label={`Timeline ${selectedTrackLabel}`}
              style={
                {
                  "--timeline-count":
                    timelineItems.length,
                } as CSSProperties
              }
            >
              {timelineItems.map((item) => {
                const tooltipText =
                  formatTimelineTooltip(item);

                const mobileDateText =
                  formatTimelineDateShort(item);

                return (
                  <li
                    key={item.id}
                    tabIndex={0}
                    aria-current={
                      item.active ? "step" : undefined
                    }
                    className={[
                      "timeline-section__timeline-item",
                      item.completed
                        ? "timeline-section__timeline-item--completed"
                        : "",
                      item.active
                        ? "timeline-section__timeline-item--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span
                      className="timeline-section__timeline-marker"
                      aria-hidden="true"
                    />

                    <div className="timeline-section__timeline-copy">
                      <span className="timeline-section__timeline-label">
                        {item.label}
                      </span>

                      {tooltipText && (
                        <span
                          className="timeline-section__timeline-tooltip"
                          role="tooltip"
                        >
                          <span className="timeline-section__timeline-tooltip-label">
                            {item.hasRange
                              ? "Periode"
                              : "Waktu"}
                          </span>

                          <span className="timeline-section__timeline-tooltip-time timeline-section__timeline-tooltip-time--desktop">
                            {tooltipText}
                          </span>

                          <span className="timeline-section__timeline-tooltip-time timeline-section__timeline-tooltip-time--mobile">
                            {mobileDateText}
                          </span>
                        </span>
                      )}
                    </div>

                    {item.active && (
                      <span className="sr-only">
                        Tahapan saat ini
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}
