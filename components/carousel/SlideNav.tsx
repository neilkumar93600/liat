"use client";

import { SlideConfig } from "@/lib/slides.config";

interface SlideNavProps {
  slides: SlideConfig[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function SlideNav({ slides, activeIndex, onNavigate }: SlideNavProps) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => onNavigate(i)}
          aria-label={`Go to ${slide.label}`}
          className="group flex items-center gap-3 justify-end"
        >
          <span
            className="text-[10px] tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
            style={{ color: "rgba(245,245,240,0.6)" }}
          >
            {slide.label}
          </span>
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 8 : 6,
              height: i === activeIndex ? 8 : 6,
              background: i === activeIndex ? "#C9A84C" : "rgba(245,245,240,0.3)",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
