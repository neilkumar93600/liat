"use client";

const BRANDS = [
  "Apple", "Tesla", "Lego", "Nike", "Adidas", "Zara", "H&M",
  "Nordstrom", "Bloomingdale's", "Macy's", "Louis Vuitton", "Tiffany & Co.",
  "Coach", "Sephora", "Lululemon", "Anthropologie", "Uniqlo", "Pandora",
  "Kate Spade", "Michael Kors", "Free People", "Banana Republic", "Express",
];

export default function BrandTicker() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <div
      className="relative w-full overflow-hidden py-3"
      style={{ borderTop: "1px solid rgba(245,245,240,0.06)", borderBottom: "1px solid rgba(245,245,240,0.06)" }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0A0A0A, transparent)", zIndex: 2 }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0A0A0A, transparent)", zIndex: 2 }}
      />

      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: "ticker 35s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((brand, i) => (
          <span
            key={i}
            className="font-sans text-xs tracking-[0.2em] uppercase"
            style={{ color: i % 7 === 0 ? "#C9A84C" : "rgba(245,245,240,0.3)" }}
          >
            {brand}
            <span
              className="mx-5 inline-block"
              style={{ color: "rgba(201,168,76,0.3)", fontSize: 8, verticalAlign: "middle" }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
