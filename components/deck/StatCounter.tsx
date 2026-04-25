"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface StatCounterProps {
  value: number;
  unit: string;
  label: string;
  isActive: boolean;
  delay?: number;
  decimals?: number;
}

export default function StatCounter({
  value,
  unit,
  label,
  isActive,
  delay = 0,
  decimals = 0,
}: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current || !numRef.current) return;
    hasAnimated.current = true;
    const el = numRef.current;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = decimals > 0
          ? obj.val.toFixed(decimals)
          : Math.round(obj.val).toString();
      },
    });
  }, [isActive, value, delay, decimals]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="text-5xl md:text-6xl font-semibold leading-none"
        style={{ fontFamily: "var(--font-display)", color: "#F5F5F0" }}
      >
        <span ref={numRef}>0</span>
        <span style={{ color: "#C9A84C" }}>{unit}</span>
      </div>
      <p
        className="text-xs tracking-widest uppercase font-sans"
        style={{ color: "rgba(245,245,240,0.5)" }}
      >
        {label}
      </p>
    </div>
  );
}
