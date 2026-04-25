"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => {
      dot.style.transform = "translate(-50%,-50%) scale(2.5)";
      ring.style.transform = "translate(-50%,-50%) scale(1.6)";
      ring.style.opacity = "0.4";
    };

    const onLeave = () => {
      dot.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.opacity = "0.7";
    };

    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const loop = () => {
      // Dot snaps instantly
      dot.style.left = `${pos.current.x}px`;
      dot.style.top = `${pos.current.y}px`;

      // Ring lags behind (lerp)
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
      interactives.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 9999,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#C9A84C",
          transform: "translate(-50%,-50%)",
          transition: "transform 0.15s ease",
          top: -100,
          left: -100,
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 9998,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.7)",
          transform: "translate(-50%,-50%)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          opacity: 0.7,
          top: -100,
          left: -100,
        }}
      />
    </>
  );
}
