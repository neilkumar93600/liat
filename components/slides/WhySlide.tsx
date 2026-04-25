"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import StatCounter from "@/components/deck/StatCounter";
import VisitorOriginChart from "@/components/deck/charts/VisitorOriginChart";
import { MOA_STATS } from "@/lib/moa-data";

gsap.registerPlugin(useGSAP);

const BULLETS = [
  "16-state regional draw — visitors from across the Midwest",
  "40% of visitors are out-of-state tourists",
  "Average 3+ hour dwell time per visit",
  "On-site Radisson Blu & JW Marriott — 4,200+ rooms",
  "MSP International Airport: 5 minutes away",
  "Direct access from I-494, 13,000 parking spaces",
];

export default function WhySlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isActive) return;
      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (!els?.length) return;
      gsap.from(Array.from(els), {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex"
      style={{ background: "#0A0A0A" }}
    >
      {/* Left: copy */}
      <div
        className="w-1/2 h-full flex flex-col justify-center px-12 md:px-20 gap-5"
        style={{ borderRight: "1px solid rgba(245,245,240,0.05)" }}
      >
        <div data-reveal className="w-12 h-[2px]" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans" style={{ color: "#C9A84C" }}>
          The Property
        </p>
        <h2
          data-reveal
          className="leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            color: "#F5F5F0",
          }}
        >
          Built at a Scale<br />
          <span style={{ color: "#C9A84C" }}>Nothing Else Matches.</span>
        </h2>
        <p data-reveal className="font-sans leading-relaxed max-w-md" style={{ color: "rgba(245,245,240,0.6)", fontSize: "0.95rem" }}>
          Bloomington, MN. 5.6 million sq ft. The largest mall in North
          America — and a commercial ecosystem no regional competitor can replicate.
        </p>
        <ul className="flex flex-col gap-2" style={{ maxWidth: 420 }}>
          {BULLETS.map((b) => (
            <li
              key={b}
              data-reveal
              className="flex items-start gap-3 font-sans text-sm"
              style={{ color: "rgba(245,245,240,0.5)" }}
            >
              <span style={{ color: "#C9A84C", flexShrink: 0 }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: donut chart + 2 key stats */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center px-10 gap-8">
        <div data-reveal className="w-full" style={{ maxWidth: 320 }}>
          <VisitorOriginChart isActive={isActive} />
        </div>

        <div data-reveal className="flex gap-12 justify-center">
          <StatCounter
            value={MOA_STATS.visitors.value}
            unit={MOA_STATS.visitors.unit}
            label={MOA_STATS.visitors.label}
            isActive={isActive}
            delay={0.8}
          />
          <StatCounter
            value={MOA_STATS.hotelRooms.value}
            unit={MOA_STATS.hotelRooms.unit}
            label={MOA_STATS.hotelRooms.label}
            isActive={isActive}
            delay={1.0}
          />
        </div>
      </div>
    </div>
  );
}
