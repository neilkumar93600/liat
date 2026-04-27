"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { SlideConfig } from "@/lib/slides.config";

const ICONS: Record<string, React.ReactNode> = {
  hero: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  why: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  retail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  luxury: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.9h7.6z" />
    </svg>
  ),
  dining: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <path d="M21 15V2a5 5 0 00-5 5v6h3.5c.83 0 1.5.67 1.5 1.5V20a2 2 0 01-4 0v-5" />
    </svg>
  ),
  entertainment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3v4M8 3v4M2 11h20" />
    </svg>
  ),
  cta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

interface DockNavProps {
  slides: SlideConfig[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

const BASE = 46;
const MAX_SCALE = 1.55;
const RADIUS = 120;

export default function DockNav({ slides, activeIndex, onNavigate }: DockNavProps) {
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(() => slides.map(() => 1));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Entrance: stagger up from below once mounted
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    gsap.set(containerRef.current, { y: 24, opacity: 0 });
    gsap.set(items, { y: 16, opacity: 0, scale: 0.75 });

    const tl = gsap.timeline({ delay: 0.8 });
    tl.to(containerRef.current, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" });
    tl.to(
      items,
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: "back.out(2.2)" },
      "-=0.3"
    );
    return () => { tl.kill(); };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const mx = e.clientX;
      setScales(
        itemRefs.current.map(ref => {
          if (!ref) return 1;
          const r = ref.getBoundingClientRect();
          const center = r.left + r.width / 2;
          const dist = Math.abs(center - mx);
          if (dist > RADIUS) return 1;
          const t = Math.cos((dist / RADIUS) * (Math.PI / 2));
          return 1 + (MAX_SCALE - 1) * t;
        })
      );
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setScales(slides.map(() => 1));
    setHoveredIndex(null);
  }, [slides]);

  return (
    <nav
      ref={containerRef}
      className="fixed bottom-5 left-1/2 z-50"
      style={{ transform: "translateX(-50%)", opacity: 0 }}
    >
      <div
        className="flex items-end gap-1.5 px-3.5 py-3"
        style={{
          background: "rgba(7,7,7,0.78)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.075)",
          borderRadius: 20,
          boxShadow:
            "0 12px 56px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05) inset",
          overflow: "visible",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, i) => {
          const scale = scales[i] ?? 1;
          const isActive = i === activeIndex;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={slide.id}
              className="relative flex flex-col items-center"
              style={{ width: BASE, flexShrink: 0, zIndex: isHovered ? 10 : 1 }}
            >
              {/* Tooltip */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "calc(100% + 10px)",
                  left: "50%",
                  transform: isHovered
                    ? "translateX(-50%) translateY(0)"
                    : "translateX(-50%) translateY(5px)",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  className="px-2.5 py-1 font-sans text-[9px] tracking-[0.2em] uppercase"
                  style={{
                    background: "rgba(7,7,7,0.92)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 6,
                    color: "rgba(245,245,240,0.75)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {slide.label}
                </div>
                {/* Caret */}
                <div
                  className="absolute left-1/2"
                  style={{
                    top: "100%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid rgba(255,255,255,0.09)",
                  }}
                />
              </div>

              {/* Icon button */}
              <button
                ref={el => { itemRefs.current[i] = el; }}
                onClick={() => onNavigate(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                aria-label={slide.label}
                style={{
                  width: BASE,
                  height: BASE,
                  flexShrink: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                  background: isActive
                    ? "rgba(201,168,76,0.13)"
                    : isHovered
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.035)",
                  border: `1px solid ${
                    isActive ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"
                  }`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive
                    ? "#C9A84C"
                    : isHovered
                    ? "rgba(245,245,240,0.8)"
                    : "rgba(245,245,240,0.32)",
                  cursor: "none",
                  outline: "none",
                }}
              >
                <div style={{ width: BASE * 0.42, height: BASE * 0.42 }}>
                  {ICONS[slide.id]}
                </div>
              </button>

              {/* Active indicator dot */}
              <div
                style={{
                  marginTop: 5,
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: isActive ? "#C9A84C" : "transparent",
                  transition: "background 0.3s ease",
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
