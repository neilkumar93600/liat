"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { CTA_PATHS, CTAType } from "@/lib/moa-data";
import ContactModal from "@/components/deck/ContactModal";
import ParticleField from "@/components/deck/ParticleField";

gsap.registerPlugin(useGSAP);

export default function CTASlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);
  const [modal, setModal] = useState<{ open: boolean; type: CTAType; email: string }>({
    open: false,
    type: "lease",
    email: "",
  });

  useGSAP(
    () => {
      if (!isActive || hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({ delay: 0.2 });

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "lines" });
        tl.from(split.lines, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
        });
      }

      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (els?.length) {
        tl.from(Array.from(els), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.6");
      }
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at 50% 60%, #1C1400 0%, #0A0A0A 60%)" }}
    >
      {/* Particles */}
      <ParticleField active={isActive} />

      {/* Grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          opacity: 0.025,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.8) 100%)",
        }}
      />

      <div className="relative z-10 text-center max-w-3xl px-8">
        <div data-reveal className="w-12 h-[2px] mx-auto mb-8" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans mb-6" style={{ color: "#C9A84C" }}>
          Your Next Move
        </p>

        <h2
          ref={titleRef}
          className="leading-none mb-8 overflow-hidden"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            color: "#F5F5F0",
          }}
        >
          Be Part of<br />
          <em style={{ color: "#C9A84C" }}>America&apos;s Stage.</em>
        </h2>

        <p data-reveal className="font-sans leading-relaxed mb-12" style={{ color: "rgba(245,245,240,0.6)", fontSize: "1.1rem" }}>
          40 million people come to Mall of America every year.
          <br />
          Brands that are here — win. Which conversation do you want to start?
        </p>

        <div data-reveal className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {CTA_PATHS.map((path, i) => (
            <button
              key={path.id}
              onClick={() => setModal({ open: true, type: path.id as CTAType, email: path.email })}
              className="px-8 py-4 rounded font-sans font-semibold tracking-wider text-sm transition-all duration-300"
              style={
                i === 0
                  ? { background: "#C9A84C", color: "#0A0A0A" }
                  : { border: "1px solid rgba(201,168,76,0.4)", color: "#F5F5F0" }
              }
              onMouseEnter={e => {
                if (i === 0) e.currentTarget.style.background = "#E8C97A";
                else {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.background = "rgba(201,168,76,0.08)";
                }
              }}
              onMouseLeave={e => {
                if (i === 0) e.currentTarget.style.background = "#C9A84C";
                else {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {path.title}
            </button>
          ))}
        </div>

        <p data-reveal className="font-sans text-xs tracking-widest" style={{ color: "rgba(245,245,240,0.2)" }}>
          MALL OF AMERICA · BLOOMINGTON, MN · MALLOFAMERICA.COM
        </p>
      </div>

      <ContactModal
        open={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        type={modal.type}
        email={modal.email}
      />
    </div>
  );
}
