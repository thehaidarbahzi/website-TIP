"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import "./AboutUsScroll.css";

const FRAME_PATHS = [
  "/about-us/frame-1.svg",
  "/about-us/frame-2.svg",
  "/about-us/frame-3.svg",
];

const TOTAL_SCROLL_STEPS = 12;
const FIRST_FRAME_HOLD_STEPS = 10;
const SECOND_FRAME_HOLD_STEPS = 1;

const frameCopy = [
  {
    title: "",
    description: "",
  },
  {
    title: "Tech Innovation Paper X Cendekia Days (TxC) 2026",
    description:
      "Diselenggarakan melalui kolaborasi yang luar biasa.",
  },
  {
    title: "LPKTA FT UGM",
    description:
      "LPKTA FT UGM merupakan Badan Semi Otonom Fakultas Teknik Universitas Gadjah Mada yang bergerak dalam bidang penelitian, kajian ilmiah, dan penerapan teknologi kepada masyarakat. Kami menjadi ruang kolaborasi bagi mahasiswa untuk mengembangkan kemampuan riset, berpikir kritis, publikasi ilmiah, dan inovasi teknologi. Dengan semangat Technology for Humanity, kami berkomitmen menghadirkan ilmu pengetahuan dan teknologi yang bermanfaat bagi bangsa dan negara.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function AboutUsScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [frameSvgs, setFrameSvgs] = useState<string[]>([]);
  const [svgLoadError, setSvgLoadError] = useState(false);
  const [activeFrame, setActiveFrame] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFrameSvgs() {
      try {
        const responses = await Promise.all(
          FRAME_PATHS.map((path) =>
            fetch(path, {
              signal: controller.signal,
              cache: "force-cache",
            })
          )
        );

        const failedResponse = responses.find((response) => !response.ok);

        if (failedResponse) {
          throw new Error(
            `Gagal memuat SVG dengan status ${failedResponse.status}`
          );
        }

        const svgContents = await Promise.all(
          responses.map((response) => response.text())
        );

        setFrameSvgs(svgContents);
        setSvgLoadError(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Gagal memuat frame About Us:", error);
        setSvgLoadError(true);
      }
    }

    loadFrameSvgs();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (frameSvgs.length !== FRAME_PATHS.length) return;

    const section = sectionRef.current;

    if (!section) return;

    let animationFrameId: number | null = null;

    const updateActiveFrame = () => {
      const scrollableDistance = section.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        setActiveFrame(0);
        return;
      }

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollInsideSection = window.scrollY - sectionTop;
      const progress = clamp(scrollInsideSection / scrollableDistance, 0, 1);
      const progressStep = Math.floor(progress * TOTAL_SCROLL_STEPS);

      const nextFrame =
        progressStep < FIRST_FRAME_HOLD_STEPS
          ? 1
          : 2;

      setActiveFrame((currentFrame) =>
        currentFrame === nextFrame ? currentFrame : nextFrame
      );
    };

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(updateActiveFrame);
    };

    updateActiveFrame();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [frameSvgs]);

  const frameStates = frameSvgs.map((svgMarkup, index) => {
    const isActive = index === activeFrame;

    return {
      svgMarkup,
      style: {
        opacity: isActive ? 1 : 0,
        transform: isActive ? "scale(1)" : "scale(1.3)",
        filter: isActive ? "blur(0px)" : "blur(22px)",
        zIndex: 3 + index,
      } as CSSProperties,
    };
  });

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="about-us"
      aria-label="Tentang kami"
    >
      <div className="about-us__stage">
        <div className="about-us__artboard">
          <img
            className="about-us__shared"
            src="/about-us/shared.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <div className="about-us__frames">
            {frameStates.map(({ svgMarkup, style }, index) => (
              <div
                key={FRAME_PATHS[index]}
                className="about-us__frame"
                aria-hidden="true"
                style={style}
                dangerouslySetInnerHTML={{
                  __html: svgMarkup,
                }}
              />
            ))}
          </div>

          {svgLoadError && (
            <div className="about-us__error" role="status">
              Konten About Us belum dapat dimuat.
            </div>
          )}
        </div>

        <div className="sr-only">
          {frameCopy.map((frame) => (
            <article key={frame.title}>
              <h2>{frame.title}</h2>
              <p>{frame.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
