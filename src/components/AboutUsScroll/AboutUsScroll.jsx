import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AboutUsScroll.css";

gsap.registerPlugin(ScrollTrigger);

const frameCopy = [
  {
    title: "",
    description: "",
  },
  {
    title: "Tech Innovation Paper X Cendekia Days (TxC) 2026",
    description: "Diselenggarakan melalui kolaborasi yang luar biasa.",
  },
  {
    title: "LPKTA FT UGM",
    description:
      "LPKTA FT UGM merupakan Badan Semi Otonom Fakultas Teknik Universitas Gadjah Mada yang bergerak dalam bidang penelitian, kajian ilmiah, dan penerapan teknologi kepada masyarakat. Kami menjadi ruang kolaborasi bagi mahasiswa untuk mengembangkan kemampuan riset, berpikir kritis, publikasi ilmiah, dan inovasi teknologi. Dengan semangat Technology for Humanity, kami berkomitmen menghadirkan ilmu pengetahuan dan teknologi yang bermanfaat bagi bangsa dan negara.",
  },
];

export default function AboutUsScroll() {
  const sectionRef = useRef(null);
  const stageRef  = useRef(null);
  const frameRefs = useRef([]);

  const [frameSvgs, setFrameSvgs] = useState(["", "", ""]);

  useLayoutEffect(() => {
    let cancelled = false;

    Promise.all(
      [1, 2, 3].map((num) =>
        fetch(`/about-us/frame-${num}.svg`)
          .then((r) => r.text())
          .catch(() => "")
      )
    ).then((results) => {
      if (!cancelled) {
        setFrameSvgs(results);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    });

    return () => { cancelled = true; };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const frames = frameRefs.current.filter(Boolean);
      if (frames.length < 3) return;

      gsap.set(frames, {
        autoAlpha: 0,
        scale: 1.35,
        filter: "blur(18px)",
        transformOrigin: "center center",
      });

      gsap.set(frames[1], {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=640%",
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to({}, { duration: 6 });

      tl.to(frames[1], {
        autoAlpha: 0,
        scale: 0.80,
        filter: "blur(14px)",
        duration: 14,
        ease: "power2.in",
      });

      tl.to(frames[2], {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 16,
        ease: "power2.out",
      }, "<8");

      tl.to({}, { duration: 35 });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="about-us"
      aria-label="Tentang kami"
    >
      <div ref={stageRef} className="about-us__stage">
        <div className="about-us__artboard">
          <img
            className="about-us__shared"
            src="/about-us/shared.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <div className="about-us__frames">
            {frameSvgs.map((svg, index) => (
              <div
                key={index}
                ref={(node) => { frameRefs.current[index] = node; }}
                className="about-us__frame"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
          </div>
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
