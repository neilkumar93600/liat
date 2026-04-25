"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LUXURY_BRANDS } from "@/lib/moa-data";

gsap.registerPlugin(useGSAP);

export default function LuxurySlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useGSAP(
    () => {
      if (!isActive) return;

      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (els?.length) {
        gsap.from(Array.from(els), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Masked image reveal (editorial wipe from right)
      if (!hasAnimated.current && imgWrapRef.current) {
        hasAnimated.current = true;
        gsap.fromTo(
          imgWrapRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            delay: 0.5,
          }
        );
      }
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center"
      style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #0E0D09 60%, #0A0A0A 100%)" }}
    >
      {/* Ghost number */}
      <div
        className="absolute inset-0 flex items-center justify-end pr-8 select-none pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(10rem, 22vw, 24rem)",
            color: "rgba(201,168,76,0.03)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          04
        </span>
      </div>

      {/* Masked editorial image — right half */}
      <div
        ref={imgWrapRef}
        className="absolute right-0 top-0 w-[55%] h-full overflow-hidden"
        style={{ clipPath: "inset(0 100% 0 0)", zIndex: 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80"
          alt="Luxury retail environment"
          className="w-full h-full object-cover"
          style={{ opacity: 0.55, transform: "scale(1.02)" }}
        />
        {/* Gradient mask — blend into left */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.7) 30%, rgba(10,10,10,0.2) 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Left vertical gold accent */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{
          width: 3,
          background: "linear-gradient(to bottom, transparent 0%, #C9A84C 25%, #C9A84C 75%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div className="relative px-16 md:px-24 max-w-[52%]" style={{ zIndex: 4 }}>
        <div data-reveal className="mb-6" style={{ width: 48, height: 2, background: "#C9A84C" }} />

        <p
          data-reveal
          className="font-sans mb-5"
          style={{ fontSize: "0.65rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A84C" }}
        >
          Luxury
        </p>

        <h2
          data-reveal
          className="leading-[0.92] mb-7"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
            color: "#F5F5F0",
            letterSpacing: "-0.02em",
          }}
        >
          The Luxury<br />
          <em style={{ color: "#C9A84C" }}>Experience</em><br />
          They Expect.
        </h2>

        <p
          data-reveal
          className="font-sans leading-relaxed mb-10"
          style={{ color: "rgba(245,245,240,0.58)", fontSize: "0.95rem", maxWidth: 360 }}
        >
          MOA&apos;s luxury wing delivers the elevated environment that premium
          brands demand. Curated foot traffic. High-income visitors. A
          destination mindset that turns browsers into buyers.
        </p>

        {/* Brand list */}
        <div data-reveal className="grid grid-cols-2 gap-0 mb-10" style={{ maxWidth: 340 }}>
          {LUXURY_BRANDS.map(brand => (
            <div
              key={brand}
              className="font-sans text-sm tracking-wider py-[10px]"
              style={{
                color: "rgba(245,245,240,0.45)",
                borderBottom: "1px solid rgba(245,245,240,0.06)",
              }}
            >
              {brand}
            </div>
          ))}
        </div>

        <div data-reveal className="flex gap-5 items-center">
          {["Flagship", "Pop-Up", "Custom Buildout"].map((label, i) => (
            <span key={label} className="flex items-center gap-2">
              {i > 0 && <span style={{ color: "rgba(201,168,76,0.3)", fontSize: 6 }}>◆</span>}
              <span
                className="font-sans text-xs tracking-widest uppercase"
                style={{ color: "rgba(245,245,240,0.3)" }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
