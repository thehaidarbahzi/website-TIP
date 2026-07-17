"use client";

import { useRef, useEffect } from "react";
import { FaChalkboard, FaTrophy } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapAnimation } from "@/app/(utils)/hooks/useGsapAnimation";

gsap.registerPlugin(ScrollTrigger);

export default function EventsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGsapAnimation(headerRef.current ?? null, "up", 0.8);
  useGsapAnimation(cardsRef.current ?? null, "up", 0.9, 0.2);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll("[data-event-card]");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current!,
            start: "top 82%",
          },
        },
      );
    }, cardsRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="events"
      className="panel items-center justify-center max-sm:min-h-[auto]"
    >
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col justify-center h-full pt-8 md:pt-24">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Events
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Perkaya perjalananmu sebagai finalis melalui rangkaian kegiatan eksklusif untuk mempersiapkan penampilan dan memperluas wawasan tentang inovasi teknologi.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full"
        >
          <div
            data-event-card
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex flex-col items-start transition-transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-purple)] rounded-bl-full opacity-10" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-purple)]/10 flex items-center justify-center text-[var(--color-brand-purple)] text-2xl mb-6">
              <FaChalkboard />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Finalist Coaching Clinic
            </h3>
            <p className="text-[var(--color-brand-purple)] font-semibold mb-4">
              Presentasikan dan Pertahankan Inovasimu
            </p>
            <p className="text-slate-600 mb-6 flex-grow">
              Sesi coaching online untuk membantu finalis menyusun presentasi, mengatur waktu, dan menjawab pertanyaan juri dengan percaya diri. Terbuka bagi seluruh finalis, dengan fokus utama pada cabang LKTI dan Essay.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-purple)]">✓</span>
                Format: Online
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-purple)]">✓</span>
                Peserta: Seluruh finalis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-purple)]">✓</span>
                Fokus: Presentasi, pitching, dan tanya jawab
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-purple)]">✓</span>
                Jadwal: Akan diumumkan
              </li>
            </ul>
          </div>

          <div
            data-event-card
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex flex-col items-start transition-transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] rounded-bl-full opacity-10" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-2xl mb-6">
              <FaTrophy />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Seminar Inovasi TKDN
            </h3>
            <p className="text-[var(--color-brand-orange)] font-semibold mb-4">
              Dari Potensi Lokal Menuju Dampak Nasional
            </p>
            <p className="text-slate-600 mb-6 flex-grow">
              Seminar eksklusif yang membahas peran TKDN dalam mendorong inovasi teknologi aplikatif dan kemajuan industri nasional.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">✓</span>
                Format: Offline
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">✓</span>
                Peserta: Seluruh finalis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">✓</span>
                Durasi: 90 menit, termasuk tanya jawab
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">✓</span>
                Jadwal: Hari Final dan Awarding
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
