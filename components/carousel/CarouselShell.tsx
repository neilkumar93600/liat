"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import SlideWrapper from "./SlideWrapper";
import SlideNav from "./SlideNav";
import ProgressBar from "./ProgressBar";
import { SlideConfig } from "@/lib/slides.config";

export interface SlideEntry extends SlideConfig {
  component: React.ComponentType<{ isActive: boolean }>;
}

interface CarouselShellProps {
  slides: SlideEntry[];
}

export default function CarouselShell({ slides }: CarouselShellProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const isAnimating = useRef(false);

  const navigate = useCallback(
    (index: number) => {
      if (isAnimating.current) return;
      const next = Math.max(0, Math.min(index, slides.length - 1));
      if (next === activeIndex) return;
      isAnimating.current = true;
      setActiveIndex(next);
      setTimeout(() => {
        isAnimating.current = false;
      }, 900);
    },
    [activeIndex, slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        navigate(activeIndex + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        navigate(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, navigate]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navigate(activeIndex + (diff > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeIndex, navigate]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      <ProgressBar current={activeIndex} total={slides.length} />
      <SlideNav
        slides={slides}
        activeIndex={activeIndex}
        onNavigate={navigate}
      />

      {slides.map((slide, i) => {
        const Component = slide.component;
        return (
          <SlideWrapper key={slide.id} isActive={i === activeIndex}>
            <Component isActive={i === activeIndex} />
          </SlideWrapper>
        );
      })}

      {/* Arrow nav */}
      <button
        onClick={() => navigate(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Previous slide"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center transition-all duration-300 disabled:opacity-0"
        style={{ color: "rgba(245,245,240,0.4)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(245,245,240,0.4)")
        }
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M13 4L7 10L13 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={() => navigate(activeIndex + 1)}
        disabled={activeIndex === slides.length - 1}
        aria-label="Next slide"
        className="fixed right-16 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center transition-all duration-300 disabled:opacity-0"
        style={{ color: "rgba(245,245,240,0.4)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(245,245,240,0.4)")
        }
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 4L13 10L7 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slide counter */}
      <div
        className="fixed bottom-6 left-16 z-50 font-sans text-xs tracking-widest"
        style={{ color: "rgba(245,245,240,0.2)" }}
      >
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>
    </div>
  );
}
