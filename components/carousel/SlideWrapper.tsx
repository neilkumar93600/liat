"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SlideWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
}

export default function SlideWrapper({ isActive, children }: SlideWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prevActive = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isActive && !prevActive.current) {
      // Wipe up from bottom — cinematic reveal
      el.style.display = "block";
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 0.85,
          ease: "power3.inOut",
        }
      );
    } else if (!isActive && prevActive.current) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          el.style.display = "none";
          el.style.opacity = "1";
          // Reset clip-path for next entrance
          gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
        },
      });
    }

    prevActive.current = isActive;
  }, [isActive]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-screen h-screen"
      style={{
        display: isActive ? "block" : "none",
        willChange: "clip-path, opacity",
        clipPath: "inset(0% 0 0 0)",
      }}
    >
      {children}
    </div>
  );
}
