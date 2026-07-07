"use client";

import React, { useRef, useEffect } from "react";
import { FaGraduationCap, FaPaintBrush } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapAnimation } from "@/hooks/useGsapAnimation";

gsap.registerPlugin(ScrollTrigger);

export default function CompetitionSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGsapAnimation(headerRef.current ?? null, "up", 0.8);
  useGsapAnimation(cardsRef.current ?? null, "up", 0.9, 0.2);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll("[data-comp-card]");
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
        }
      );
    }, cardsRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="competition" className="panel items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col justify-center h-full pt-16">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kategori Kompetisi
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Pilih kategori yang sesuai dengan jenjang pendidikanmu dan tunjukkan kemampuan terbaikmu!
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full">
          <div data-comp-card className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex flex-col items-start transition-transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-purple)] rounded-bl-full opacity-10" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-purple)]/10 flex items-center justify-center text-[var(--color-brand-purple)] text-2xl mb-6">
              <FaGraduationCap />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Mahasiswa</h3>
            <p className="text-[var(--color-brand-purple)] font-semibold mb-4">LKTI & Essay</p>
            <p className="text-slate-600 mb-6 flex-grow">
              Kompetisi karya tulis ilmiah dan essay tingkat nasional untuk mahasiswa/i aktif D3/D4/S1 seluruh Indonesia.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2">✓ Tema inovasi teknologi</li>
              <li className="flex items-center gap-2">✓ Tim maksimal 3 orang</li>
              <li className="flex items-center gap-2">✓ Presentasi finalis</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-[var(--color-brand-purple)] transition-colors mt-auto">
              Baca Panduan Mahasiswa
            </button>
          </div>

          <div data-comp-card className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex flex-col items-start transition-transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-pink)] rounded-bl-full opacity-10" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-pink)]/10 flex items-center justify-center text-[var(--color-brand-pink)] text-2xl mb-6">
              <FaPaintBrush />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Siswa SMA/SMK/MA</h3>
            <p className="text-[var(--color-brand-pink)] font-semibold mb-4">Lomba Poster</p>
            <p className="text-slate-600 mb-6 flex-grow">
              Ajang unjuk kreativitas melalui desain poster informatif dan menarik untuk siswa SMA/sederajat seluruh Indonesia.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2">✓ Desain orisinal</li>
              <li className="flex items-center gap-2">✓ Individu atau tim (maks 3 orang)</li>
              <li className="flex items-center gap-2">✓ Penilaian publik (likes)</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-[var(--color-brand-pink)] transition-colors mt-auto">
              Baca Panduan SMA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
