"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Gold line expands from center
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 0.7, ease: "power3.out" }
    );

    // Title letters stagger up
    tl.from(
      ".load-char",
      {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.1"
    );

    // Sub text
    tl.from(
      subRef.current,
      { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Tag line
    tl.from(
      tagRef.current,
      { opacity: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // Hold
    tl.to({}, { duration: 0.6 });

    // Fade out entire screen
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [onComplete]);

  const TITLE = "MALL OF AMERICA";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "#0A0A0A", zIndex: 1000 }}
    >
      {/* Gold line */}
      <div
        ref={lineRef}
        className="mb-10"
        style={{ width: 180, height: 1, background: "#C9A84C" }}
      />

      {/* Title — char-by-char */}
      <div
        ref={titleRef}
        className="overflow-hidden"
        style={{ lineHeight: 1 }}
      >
        <h1
          className="flex gap-[0.06em] tracking-[0.25em]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 5rem)",
            color: "#F5F5F0",
            letterSpacing: "0.22em",
          }}
        >
          {TITLE.split("").map((char, i) =>
            char === " " ? (
              <span key={i} style={{ width: "0.5em" }} />
            ) : (
              <span
                key={i}
                className="load-char inline-block"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            )
          )}
        </h1>
      </div>

      {/* Sub */}
      <div ref={subRef} className="mt-6 flex items-center gap-4">
        <span style={{ width: 40, height: 1, background: "rgba(201,168,76,0.4)", display: "block" }} />
        <span
          className="font-sans text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(245,245,240,0.4)" }}
        >
          Bloomington, Minnesota
        </span>
        <span style={{ width: 40, height: 1, background: "rgba(201,168,76,0.4)", display: "block" }} />
      </div>

      {/* Tag */}
      <p
        ref={tagRef}
        className="mt-12 font-sans text-xs tracking-widest uppercase"
        style={{ color: "rgba(201,168,76,0.5)" }}
      >
        Interactive Commercial Presentation
      </p>
    </div>
  );
}
