"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import VideoBackground from "@/components/deck/VideoBackground";
import StatCounter from "@/components/deck/StatCounter";
import ParticleField from "@/components/deck/ParticleField";
import { MOA_STATS } from "@/lib/moa-data";

gsap.registerPlugin(useGSAP);

export default function HeroSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useGSAP(
    () => {
      if (!isActive || hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.8, ease: "power2.out" }
      );

      tl.from(eyebrowRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "lines" });
        tl.from(
          split.lines,
          { y: 120, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power3.out" },
          "-=0.3"
        );
      }

      tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.9, ease: "power2.out" }, "-=0.6");

      if (statsRef.current?.children) {
        tl.from(
          Array.from(statsRef.current.children),
          { y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power2.out" },
          "-=0.5"
        );
      }
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-end"
      style={{ background: "#0A0A0A", paddingBottom: "clamp(4rem, 8vh, 7rem)" }}
    >
      {/* Video background */}
      <VideoBackground
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4"
        poster="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1920&q=80"
        overlayOpacity={0.55}
      />

      {/* Three.js particle field — floats above video, below text */}
      <ParticleField active={isActive} />

      {/* Ghost section number — right side */}
      <div
        className="absolute right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(8rem, 18vw, 18rem)",
          color: "rgba(201,168,76,0.04)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          zIndex: 2,
        }}
      >
        01
      </div>

      {/* Vertical brand label — far right */}
      <div
        className="absolute right-8 bottom-24 flex flex-col items-center gap-3 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <div style={{ width: 1, height: 48, background: "rgba(201,168,76,0.25)" }} />
        <p
          className="font-sans text-[10px] tracking-[0.25em] uppercase"
          style={{
            color: "rgba(245,245,240,0.25)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Mall of America
        </p>
      </div>

      {/* Main content */}
      <div
        className="relative px-12 md:px-20 max-w-5xl"
        style={{ zIndex: 3 }}
      >
        <div
          ref={lineRef}
          className="mb-6"
          style={{ width: 56, height: 2, background: "#C9A84C" }}
        />

        <p
          ref={eyebrowRef}
          className="font-sans mb-5"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#C9A84C",
          }}
        >
          North America&apos;s #1 Shopping &amp; Entertainment Destination
        </p>

        <h1
          ref={titleRef}
          className="overflow-hidden mb-7"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.2rem, 7.5vw, 8rem)",
            color: "#F5F5F0",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          Where{" "}
          <em style={{ color: "#C9A84C", fontStyle: "italic" }}>40 Million</em>
          <br />
          Stories Begin.
        </h1>

        <p
          ref={subtitleRef}
          className="font-sans leading-relaxed mb-12 max-w-lg"
          style={{ fontSize: "1.05rem", color: "rgba(245,245,240,0.6)" }}
        >
          Not a mall. America&apos;s most visited destination — a city within
          a city, drawing from all 50 states and 70+ countries.
        </p>

        {/* Stats */}
        <div ref={statsRef} className="flex flex-wrap gap-10 md:gap-16">
          {[
            { ...MOA_STATS.sqFt, delay: 1.5, decimals: 1 },
            { ...MOA_STATS.stores, delay: 1.7, decimals: 0 },
            { ...MOA_STATS.visitors, delay: 1.9, decimals: 0 },
          ].map(s => (
            <StatCounter
              key={s.label}
              value={s.value}
              unit={s.unit}
              label={s.label}
              isActive={isActive}
              delay={s.delay}
              decimals={s.decimals}
            />
          ))}
        </div>
      </div>

      {/* Navigate hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <p className="font-sans text-[10px] tracking-widest uppercase" style={{ color: "rgba(245,245,240,0.2)" }}>
          Navigate
        </p>
        <div
          className="w-[1px] h-8"
          style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)" }}
        />
      </div>
    </div>
  );
}
