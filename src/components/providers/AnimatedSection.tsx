"use client";

import { forwardRef, useRef, useEffect } from "react";
import { useGsapAnimation } from "@/hooks/useGsapAnimation";

export type AnimationType = "fade" | "up" | "down" | "left" | "right" | "scale";

interface AnimatedSectionProps {
  children: React.ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  className?: string;
  id?: string;
}

const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, type = "up", duration = 0.85, delay = 0, staggerChildren = 0.12, className, id }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const el = (forwardedRef as React.RefObject<HTMLDivElement | null>)?.current ?? internalRef.current;

    useGsapAnimation(el ?? null, type, duration, delay, staggerChildren);

    return (
      <div ref={internalRef} id={id} className={className}>
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
