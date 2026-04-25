"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5">
      <div
        className="h-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: "#C9A84C",
          transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
        }}
      />
    </div>
  );
}
