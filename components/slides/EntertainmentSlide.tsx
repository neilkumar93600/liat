"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import VideoBackground from "@/components/deck/VideoBackground";
import { ATTRACTIONS } from "@/lib/moa-data";

gsap.registerPlugin(useGSAP);

export default function EntertainmentSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isActive) return;
      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (!els?.length) return;
      gsap.from(Array.from(els), {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-end pb-20">
      <VideoBackground
        src="/videos/entertainment-loop.mp4"
        poster="https://images.unsplash.com/photo-1549213783-8284d0336c4f?auto=format&fit=crop&w=1920&q=80"
        overlayOpacity={0.5}
      />

      {/* Bottom gradient for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.5) 50%, transparent 100%)" }}
      />

      <div className="relative z-10 px-12 md:px-20 w-full">
        <div data-reveal className="w-12 h-[2px] mb-6" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans mb-4" style={{ color: "#C9A84C" }}>
          Attractions &amp; Entertainment
        </p>
        <h2
          data-reveal
          className="leading-none mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            color: "#F5F5F0",
          }}
        >
          The Theme Park<br />
          <span style={{ color: "#C9A84C" }}>Inside the Mall.</span>
        </h2>
        <p data-reveal className="font-sans max-w-2xl mb-10" style={{ color: "rgba(245,245,240,0.7)", fontSize: "1rem" }}>
          MOA&apos;s entertainment offering generates foot traffic no standalone
          mall can match — and keeps visitors on-site 3× longer.
        </p>

        {/* Attraction cards */}
        <div data-reveal className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ATTRACTIONS.map(attr => (
            <div
              key={attr.name}
              className="rounded-lg px-4 py-4 transition-all duration-300 cursor-default"
              style={{
                background: "rgba(245,245,240,0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(245,245,240,0.1)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(245,245,240,0.1)")}
            >
              <div className="text-2xl mb-2">{attr.icon}</div>
              <p className="font-sans font-medium text-xs mb-1" style={{ color: "#F5F5F0" }}>{attr.name}</p>
              <p className="font-sans text-xs" style={{ color: "rgba(245,245,240,0.4)" }}>{attr.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
