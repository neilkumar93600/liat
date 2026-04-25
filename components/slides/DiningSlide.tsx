"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import VideoBackground from "@/components/deck/VideoBackground";
import { DINING_VENUES } from "@/lib/moa-data";

gsap.registerPlugin(useGSAP);

export default function DiningSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isActive) return;
      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (!els?.length) return;
      gsap.from(Array.from(els), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-full flex" style={{ background: "#0A0A0A" }}>
      {/* Left: video */}
      <div className="w-1/2 h-full relative">
        <VideoBackground
          src="/videos/dining-loop.mp4"
          poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
          overlayOpacity={0.25}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, transparent 60%, #0A0A0A 100%)" }}
        />
      </div>

      {/* Right: venue list */}
      <div className="w-1/2 h-full flex flex-col justify-center px-10 md:px-14 py-12">
        <div data-reveal className="w-12 h-[2px] mb-6" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans mb-4" style={{ color: "#C9A84C" }}>
          Dining &amp; Lifestyle
        </p>
        <h2
          data-reveal
          className="leading-tight mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
            color: "#F5F5F0",
          }}
        >
          50+ Restaurants.<br />Zero Afterthoughts.
        </h2>
        <p data-reveal className="font-sans mb-8 max-w-md" style={{ color: "rgba(245,245,240,0.6)", fontSize: "0.95rem" }}>
          MOA&apos;s F&amp;B mix is a destination draw in itself — experiential
          concepts, beloved national brands, and local Minnesota icons all
          under one roof.
        </p>

        <div className="flex flex-col gap-4 overflow-hidden" style={{ maxHeight: 280 }}>
          {DINING_VENUES.map((venue, i) => (
            <div
              key={venue.name}
              data-reveal
              className="flex gap-4 items-start pb-4"
              style={{ borderBottom: "1px solid rgba(245,245,240,0.06)" }}
            >
              <span
                className="shrink-0 mt-0.5"
                style={{ fontFamily: "var(--font-display)", color: "#C9A84C", fontSize: "1.1rem" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-sm" style={{ color: "#F5F5F0" }}>{venue.name}</p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(245,245,240,0.4)" }}>{venue.description}</p>
              </div>
              <span
                className="shrink-0 text-xs font-sans tracking-wider uppercase"
                style={{ color: "rgba(245,245,240,0.25)" }}
              >
                {venue.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
