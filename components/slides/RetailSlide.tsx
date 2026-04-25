"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RETAIL_BRANDS } from "@/lib/moa-data";
import CategoryBarChart from "@/components/deck/charts/CategoryBarChart";
import BrandTicker from "@/components/deck/BrandTicker";

gsap.registerPlugin(useGSAP);

export default function RetailSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isActive) return;
      const els = containerRef.current?.querySelectorAll("[data-reveal]");
      if (!els?.length) return;
      gsap.from(Array.from(els), {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
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
      {/* Ghost number */}
      <div
        className="absolute right-8 bottom-8 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(8rem, 16vw, 16rem)",
          color: "rgba(201,168,76,0.03)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        03
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <div data-reveal className="w-12 h-[2px] mb-6" style={{ background: "#C9A84C" }} />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase font-sans mb-4" style={{ color: "#C9A84C" }}>
          Retail
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
          520+ Brands. One Address.
        </h2>
        <p data-reveal className="font-sans mb-8 max-w-2xl" style={{ color: "rgba(245,245,240,0.6)", fontSize: "1rem" }}>
          From luxury flagships to pop-up shops, MOA hosts the most comprehensive
          retail mix in North America. Every category. Every price point. Every opportunity.
        </p>

        {/* Brand grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-10">
          {RETAIL_BRANDS.map((brand) => (
            <div
              key={brand}
              data-reveal
              className="rounded px-3 py-2 text-center text-xs font-sans transition-all duration-300 cursor-default"
              style={{
                border: "1px solid rgba(245,245,240,0.1)",
                color: "rgba(245,245,240,0.6)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                e.currentTarget.style.color = "#F5F5F0";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(245,245,240,0.1)";
                e.currentTarget.style.color = "rgba(245,245,240,0.6)";
              }}
            >
              {brand}
            </div>
          ))}
          <div
            data-reveal
            className="rounded px-3 py-2 text-center text-xs font-sans"
            style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}
          >
            +480 more
          </div>
        </div>

        {/* Two-column: chart + ticker */}
        <div data-reveal className="grid grid-cols-2 gap-10 items-start">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(245,245,240,0.3)" }}>
              Tenant Mix by Category
            </p>
            <CategoryBarChart isActive={isActive} />
          </div>
          <div className="flex flex-col gap-3 pt-6">
            <p className="font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(245,245,240,0.3)" }}>
              By the Numbers
            </p>
            {[
              { label: "Avg. Transaction Value", value: "$85+" },
              { label: "Repeat Visit Rate", value: "68%" },
              { label: "In-Mall Dwell Time", value: "3.2 hrs" },
              { label: "Annual Leasing Revenue", value: "$500M+" },
            ].map(item => (
              <div
                key={item.label}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid rgba(245,245,240,0.06)" }}
              >
                <span className="font-sans text-xs" style={{ color: "rgba(245,245,240,0.4)" }}>{item.label}</span>
                <span className="font-sans text-sm font-semibold" style={{ color: "#C9A84C" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling brand ticker — bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <BrandTicker />
      </div>
    </div>
  );
}
