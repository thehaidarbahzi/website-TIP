"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTrophy,
  FaUpload,
  FaFlagCheckered,
  FaInfoCircle,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapAnimation } from "../../hooks/useGsapAnimation";
import { useEventTimeline } from "../../hooks/useEventTimeline";
import type { EventCategory } from "../../types/event";

gsap.registerPlugin(ScrollTrigger);

const MONTHS_ID: Record<string, string> = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
};

function formatDateRange(start?: number, end?: number): string {
  if (!start) return "";
  const s = new Date(start);
  const sDay = s.getDate();
  const sMonth = MONTHS_ID[String(s.getMonth() + 1).padStart(2, "0")];

  if (!end) return `${sDay} ${sMonth}`;

  const e = new Date(end);
  const eDay = e.getDate();
  const eMonth = MONTHS_ID[String(e.getMonth() + 1).padStart(2, "0")];

  if (sMonth === eMonth) return `${sDay} - ${eDay} ${sMonth}`;
  return `${sDay} ${sMonth} - ${eDay} ${eMonth}`;
}

function formatSingleTime(time?: number): string {
  if (!time) return "";
  const d = new Date(time);
  const day = d.getDate();
  const month = MONTHS_ID[String(d.getMonth() + 1).padStart(2, "0")];
  return `${day} ${month}`;
}

function stageToDisplayDate(stage: {
  start?: number;
  end?: number;
  time?: number;
}): string {
  if (stage.time) return formatSingleTime(stage.time);
  if (stage.start || stage.end) return formatDateRange(stage.start, stage.end);
  return "";
}

const ICON_MAP: Record<string, React.ReactNode> = {
  pendaftaran: <FaInfoCircle />,
  open_registration: <FaInfoCircle />,
  early_bird: <FaCalendarAlt />,
  gelombang: <FaCalendarAlt />,
  extend: <FaCalendarAlt />,
  seleksi: <FaCheckCircle />,
  penilaian: <FaCheckCircle />,
  pengumuman: <FaCheckCircle />,
  announce: <FaCheckCircle />,
  like: <FaUpload />,
  pengumpulan: <FaFlagCheckered />,
  fullpaper: <FaFlagCheckered />,
  final: <FaTrophy />,
  awarding: <FaTrophy />,
};

function getIconForKey(key: string): React.ReactNode {
  for (const [pattern, icon] of Object.entries(ICON_MAP)) {
    if (key.includes(pattern)) return icon;
  }
  return <FaCalendarAlt />;
}

function categoryToEvents(
  cat: EventCategory | undefined,
): { id: number; title: string; date: string; icon: React.ReactNode }[] {
  if (!cat) return [];
  return Object.entries(cat)
    .sort(([, a], [, b]) => (a.order ?? 999) - (b.order ?? 999))
    .map(([key, stage], index) => ({
      id: index + 1,
      title: stage.label,
      date: stageToDisplayDate(stage),
      icon: getIconForKey(key),
    }));
}

export default function TimelineSection() {
  const [activeTab, setActiveTab] = useState<"lkti" | "poster">("lkti");
  const { timeline, loading } = useEventTimeline();

  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGsapAnimation(headerRef.current ?? null, "up", 0.8);
  useGsapAnimation(tabsRef.current ?? null, "fade", 0.6, 0.2);
  useGsapAnimation(timelineRef.current ?? null, "up", 0.9, 0.3);

  useEffect(() => {
    if (!timelineRef.current || loading) return;
    const items = timelineRef.current.querySelectorAll("[data-timeline-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 82%",
        },
      },
    );
  }, [activeTab, loading, timeline]);

  const eventsToDisplay =
    activeTab === "lkti"
      ? categoryToEvents(timeline?.lkti)
      : categoryToEvents(timeline?.poster);

  return (
    <section id="timeline" className="panel items-center justify-center">
      <div className="w-full h-full flex flex-col pt-20 md:pt-140 pb-12 overflow-y-auto no-scrollbar relative">
        <div className="max-w-5xl mx-auto px-6 w-full flex-grow">
          <div ref={headerRef} className="text-center mb-12 flex-shrink-0">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 drop-shadow-sm">
              Timeline Perlombaan
            </h2>
            <p className="text-slate-700 max-w-2xl mx-auto mb-8 font-medium">
              Catat tanggal-tanggal penting ini dan jangan sampai terlewatkan
              kesempatanmu untuk menjadi juara di TxC 2026.
            </p>

            <div ref={tabsRef} className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab("lkti")}
                className={`px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 shadow-lg ${activeTab === "lkti" ? "bg-[var(--color-brand-purple)] text-white scale-105" : "bg-white/50 backdrop-blur-md border border-white text-slate-700 hover:bg-white/80"}`}
              >
                LKTI & ESSAY
              </button>
              <button
                onClick={() => setActiveTab("poster")}
                className={`px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 shadow-lg ${activeTab === "poster" ? "bg-[var(--color-brand-pink)] text-white scale-105" : "bg-white/50 backdrop-blur-md border border-white text-slate-700 hover:bg-white/80"}`}
              >
                DIGITAL POSTER
              </button>
            </div>
          </div>

          <div
            ref={timelineRef}
            className="relative w-full max-w-4xl mx-auto mt-4 pb-16 grow"
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--color-brand-purple)] via-[var(--color-brand-pink)] to-[var(--color-brand-orange)] rounded-full hidden md:block opacity-30"></div>

            <div className="space-y-6 md:space-y-0 relative z-10">
              {loading ? (
                <div className="text-center py-20 text-slate-500 font-medium">
                  Memuat timeline...
                </div>
              ) : eventsToDisplay.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium">
                  Belum ada data timeline.
                </div>
              ) : (
                eventsToDisplay.map((event, index) => (
                  <div
                    key={event.id}
                    data-timeline-item
                    className={`relative flex flex-col md:flex-row items-center justify-center md:justify-between w-full group ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border-4 border-[var(--color-brand-purple)] rounded-full hidden md:flex items-center justify-center text-[var(--color-brand-purple)] text-lg shadow-[0_0_15px_rgba(164,69,201,0.5)] group-hover:scale-125 group-hover:bg-[var(--color-brand-purple)] group-hover:text-white transition-all duration-300 z-20">
                      {event.icon}
                    </div>

                    <div className="w-full md:w-5/12 py-3">
                      <div
                        className={`bg-white/40 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/60 transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-white/70 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${
                          index % 2 === 0
                            ? "md:text-right md:mr-6"
                            : "md:text-left md:ml-6"
                        }`}
                      >
                        <span
                          className={`inline-block px-4 py-1.5 font-bold text-xs rounded-full mb-3 shadow-inner ${activeTab === "lkti" ? "bg-purple-100/80 text-[var(--color-brand-purple-dark)]" : "bg-pink-100/80 text-[var(--color-brand-pink-dark)]"}`}
                        >
                          {event.date}
                        </span>
                        <h3 className="text-xl font-bold text-slate-800 drop-shadow-sm">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
