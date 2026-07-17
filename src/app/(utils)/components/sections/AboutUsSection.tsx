"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./AboutUs.module.css";

const logoLPKTA = "/cropped-LOGO-LPKTA-1.png";
const logoCT = "/logo CT fIX DAN rESMI 1.png";

const frames = [
  {
    id: "empty",
    type: "empty" as const,
  },
  {
    id: "opening",
    type: "opening" as const,
  },
  {
    id: "lpkta",
    type: "organization" as const,
    title: "LPKTA FT UGM",
    logo: logoLPKTA,
    logoAlt: "Logo LPKTA FT UGM",
    description:
      "LPKTA FT UGM merupakan Badan Semi Otonom Fakultas Teknik Universitas Gadjah Mada yang bergerak dalam bidang penelitian, kajian ilmiah, dan penerapan teknologi kepada masyarakat. Kami menjadi ruang kolaborasi bagi mahasiswa untuk mengembangkan kemampuan riset, berpikir kritis, publikasi ilmiah, dan inovasi teknologi. Dengan semangat Technology for Humanity, kami berkomitmen menghadirkan ilmu pengetahuan dan teknologi yang bermanfaat bagi bangsa dan negara.",
  },
  {
    id: "cendekia-teknika",
    type: "organization" as const,
    title: "Cendekia Teknika",
    logo: logoCT,
    logoAlt: "Logo Cendekia Teknika",
    description:
      "Cendekia Teknika Universitas Gadjah Mada (CT UGM) merupakan Badan Semi Otonom Fakultas Teknik UGM yang bergerak di bidang akademik dan keprofesian teknik. CT UGM menjadi ruang bagi mahasiswa untuk mengembangkan kompetensi, karakter, wawasan, dan jejaring melalui seminar, workshop, kompetisi, serta berbagai program pengembangan minat dan bakat.",
  },
];

const frameAnimation = {
  initial: {
    opacity: 0,
    scale: 1.35,
    filter: "blur(22px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.55,
    filter: "blur(22px)",
  },
};

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateActiveFrame = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const scrollInsideSection = window.scrollY - sectionTop;
      const progress = Math.min(
        Math.max(scrollInsideSection / scrollableDistance, 0),
        1
      );

      const nextFrame = Math.min(
        Math.floor(progress * frames.length),
        frames.length - 1
      );

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

    window.addEventListener("resize", updateActiveFrame);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveFrame);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const currentFrame = frames[activeFrame];

  return (
    <section
      ref={sectionRef}
      className={styles.aboutUs}
      aria-label="Tentang penyelenggara Tech Innovation Paper"
    >
      <div className={styles.aboutUsSticky}>
        <div className={styles.aboutUsBackground}>
          <svg
            className={styles.aboutUsSvg}
            viewBox="0 0 1440 778"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M1459 776.75H-21V752.978V657.039V120.461V96.6887V0.75H461.979H1459V96.6887V120.461V657.039V776.75Z"
              fill="#FD5102"
            />

            <path
              d="M-21 120.461V776.75H1459V120.461M-21 120.461H1459M-21 120.461V96.6887V0.75H461.979H1459V96.6887V120.461M1459 657.039H-21V752.978"
              stroke="black"
              strokeWidth="1.5"
            />

            <rect
              x="-21.25"
              y="88.5"
              width="1479.5"
              height="657.5"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="12 12"
            />
          </svg>
        </div>

        <div className={styles.aboutUsViewport}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={currentFrame.id}
              className={styles.aboutUsFrame}
              variants={frameAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {currentFrame.type === "empty" ? (
                <EmptyFrame />
              ) : currentFrame.type === "opening" ? (
                <OpeningFrame />
              ) : (
                <OrganizationFrame frame={currentFrame} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.aboutUsProgress} aria-hidden="true">
          {frames.map((frame, index) => (
            <span
              key={frame.id}
              className={`${styles.aboutUsProgressDot} ${
                index === activeFrame
                  ? styles.aboutUsProgressDotActive
                  : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EmptyFrame() {
  return <div className={styles.emptyFrame} />;
}

function OpeningFrame() {
  return (
    <div className={styles.openingFrame}>
      <motion.h2
        className={styles.openingFrameTitle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.65,
          delay: 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Tech Innovation Paper X Cendekia Days (TxC)
        <span>2026</span>
      </motion.h2>

      <motion.p
        className={styles.openingFrameSubtitle}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        diselenggarakan melalui kolaborasi yang luar biasa
      </motion.p>
    </div>
  );
}

interface OrganizationFrameProps {
  frame: (typeof frames)[2] | (typeof frames)[3];
}

function OrganizationFrame({ frame }: OrganizationFrameProps) {
  return (
    <div className={styles.organizationFrame}>
      <motion.h2
        className={styles.organizationFrameTitle}
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.55,
          delay: 0.12,
        }}
      >
        {frame.title}
      </motion.h2>

      <motion.div
        className={styles.organizationFrameLogoWrapper}
        initial={{
          opacity: 0,
          scale: 1.15,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.6,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src={frame.logo}
          alt={frame.logoAlt}
          className={styles.organizationFrameLogo}
        />
      </motion.div>

      <motion.p
        className={styles.organizationFrameDescription}
        initial={{
          opacity: 0,
          y: 25,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.65,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {frame.description}
      </motion.p>
    </div>
  );
}
