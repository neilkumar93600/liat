"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CTA_PATHS, EVENTS_HIGHLIGHTS, CTAType } from "@/lib/moa-data";
import ContactModal from "@/components/deck/ContactModal";
import EventCapacityChart from "@/components/deck/charts/EventCapacityChart";

gsap.registerPlugin(useGSAP);

export default function EventsSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<{ open: boolean; type: CTAType; email: string }>({
    open: false,
    type: "events",
    email: "",
  });

  useGSAP(
    () => {
      if (!isActive) return;
      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (!els?.length) return;
      gsap.from(Array.from(els), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { dependencies: [isActive], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-center px-12 md:px-20 py-12"
      style={{ background: "#0A0A0A" }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <div data-reveal className="w-12 h-[2px] mb-6" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans mb-4" style={{ color: "#C9A84C" }}>
          Events Platform
        </p>
        <h2
          data-reveal
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#F5F5F0",
          }}
        >
          The Stage is Set.<br />
          <span style={{ color: "#C9A84C" }}>Your Brand is the Show.</span>
        </h2>
        <p data-reveal className="font-sans mb-8 max-w-2xl" style={{ color: "rgba(245,245,240,0.6)", fontSize: "1rem" }}>
          MOA hosts 400+ events per year — from national concert tours and
          championship sports to corporate product launches and brand
          activations reaching millions.
        </p>

        {/* Two-column: highlight cards + capacity chart */}
        <div data-reveal className="grid grid-cols-2 gap-8 mb-10 items-start">
          <div className="grid grid-cols-2 gap-3">
            {EVENTS_HIGHLIGHTS.map(event => (
              <div
                key={event.name}
                className="rounded-lg p-4"
                style={{ border: "1px solid rgba(245,245,240,0.1)" }}
              >
                <p className="text-xs tracking-widest uppercase font-sans mb-2" style={{ color: "#C9A84C" }}>
                  {event.type}
                </p>
                <p className="font-sans font-medium text-sm mb-1" style={{ color: "#F5F5F0" }}>{event.name}</p>
                <p className="font-sans text-sm" style={{ color: "rgba(245,245,240,0.4)" }}>{event.capacity}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(245,245,240,0.3)" }}>
              Event Capacity Range
            </p>
            <EventCapacityChart isActive={isActive} />
          </div>
        </div>

        {/* CTA cards */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CTA_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setModal({ open: true, type: path.id as CTAType, email: path.email })}
              className="group rounded-lg p-6 text-left transition-all duration-300"
              style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#C9A84C";
                e.currentTarget.style.background = "rgba(201,168,76,0.04)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <p
                className="mb-1 transition-colors duration-300"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#F5F5F0" }}
              >
                {path.title}
              </p>
              <p className="font-sans text-sm mb-4" style={{ color: "rgba(245,245,240,0.4)" }}>
                {path.subtitle}
              </p>
              <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#C9A84C" }}>
                {path.cta} →
              </span>
            </button>
          ))}
        </div>
      </div>

      <ContactModal
        open={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        type={modal.type}
        email={modal.email}
      />
    </div>
  );
}
