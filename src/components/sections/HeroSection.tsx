"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      gsap.fromTo(paraRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.25, ease: "power3.out" });
      gsap.fromTo(buttonsRef.current, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.4)" });
      gsap.fromTo(decoRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.1, ease: "power2.out" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="hero" className="relative isolate flex min-h-[100svh] w-full overflow-hidden bg-[#DA4E86] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(255,106,0,0.28),_transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.08)_100%)]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/hero/pattern.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "400px 400px",
            backgroundPosition: "center top",
          }}
        />

        <div ref={decoRef} className="pointer-events-none absolute inset-x-0 top-[-200] z-10 h-full">
          <div className="absolute left-[-120] top-0 h-[clamp(11rem,34vw,19rem)] w-[clamp(12rem,35vw,24rem)] opacity-90 sm:opacity-100 lg:h-[31rem] lg:w-[36rem] hidden lg:block">
            <Image
              src="/hero/dekorasiHeader.svg"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-contain object-left-top"
            />
          </div>

          <div className="absolute right-[-120] top-0 h-[clamp(11rem,34vw,19rem)] w-[clamp(12rem,35vw,24rem)] opacity-90 sm:opacity-100 lg:h-[31rem] lg:w-[36rem] hidden lg:block">
            <Image
              src="/hero/dekorasiHeader.svg"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-contain object-right-top"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-1 flex-col items-center justify-center pt-[clamp(5.5rem,10vh,8.5rem)] pb-[clamp(8rem,14vh,10rem)] text-center">
            <h1 ref={headingRef} className="max-w-5xl text-[clamp(1.6rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
              <span className="block">TKDN-BASED INNOVATION</span>
              <span className="block">FOR NATIONAL PROGRESS</span>
            </h1>

            <p ref={paraRef} className="mt-6 max-w-3xl text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.35] text-white/92">
              <span className="block">Be part of UGM&apos;s leading technology innovation competition</span>
              <span className="block">Collaborate and engineer the future of national progress</span>
            </p>

            <div ref={buttonsRef} className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                href="/pendaftaran"
                className="inline-flex w-full items-center justify-center rounded-[1.1rem] bg-[#B44DFF] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(116,43,171,0.38)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#A343F2] sm:min-w-[15rem] sm:w-auto sm:text-lg"
              >
                Register now!
              </Link>

              <Link
                href="/guidebook"
                className="inline-flex w-full items-center justify-center rounded-[1.1rem] bg-[#FF6A00] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(168,63,0,0.34)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#ff5c00] sm:min-w-[15rem] sm:w-auto sm:text-lg"
              >
                Guidebook
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <Image
            src="/hero/segitiga.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={282}
            priority
            className="h-auto w-[4000vw] max-w-none translate-y-[0px] select-none"
          />
        </div>
      </section>
    </>
  );
}
