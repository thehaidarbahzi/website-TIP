"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIM_MAP: Record<string, gsap.TweenVars> = {
  up:    { opacity: 0, y: 60 },
  down:  { opacity: 0, y: -60 },
  left:  { opacity: 0, x: -60 },
  right: { opacity: 0, x: 60 },
  scale: { opacity: 0, scale: 0.85 },
  fade:  { opacity: 0 },
};

const FALLBACK: gsap.TweenVars = { opacity: 0, y: 40 };

export function useGsapAnimation(
  el: HTMLElement | null,
  type: "fade" | "up" | "down" | "left" | "right" | "scale" = "up",
  duration = 0.85,
  delay = 0,
  staggerChildren?: number
) {
  useEffect(() => {
    if (!el) return;

    const fromVars = ANIM_MAP[type] ?? FALLBACK;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          ...(staggerChildren != null
            ? {
                stagger: staggerChildren,
                onStart: () => {
                  const children = el.children;
                  if (children.length > 1) {
                    gsap.fromTo(
                      children,
                      { opacity: 0, y: 30 },
                      {
                        opacity: 1,
                        y: 0,
                        duration: duration * 0.8,
                        stagger: staggerChildren,
                        ease: "power2.out",
                        scrollTrigger: {
                          trigger: el,
                          start: "top 85%",
                        },
                      }
                    );
                  }
                },
              }
            : {}),
        }
      );
    }, el);

    return () => ctx.revert();
  }, [el, type, duration, delay, staggerChildren]);
}
