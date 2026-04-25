"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DATA = [
  { name: "Out-of-State Tourists", value: 40, color: "#C9A84C" },
  { name: "Regional Visitors",     value: 35, color: "#E8C97A" },
  { name: "Local Minnesotans",     value: 25, color: "rgba(245,245,240,0.15)" },
];

const RADIAN = Math.PI / 180;

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number; name: string;
}) {
  if (percent < 0.1) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fill: "#0A0A0A", fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

interface Props { isActive: boolean }

export default function VisitorOriginChart({ isActive }: Props) {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (!mounted) setMounted(true);
    const t = setTimeout(() => setAnimate(true), 400);
    return () => clearTimeout(t);
  }, [isActive, mounted]);

  if (!mounted) return <div style={{ height: 260 }} />;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {/* Donut */}
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={animate}
              animationBegin={0}
              animationDuration={1200}
              labelLine={false}
              label={CustomLabel as never}
            >
              {DATA.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1A1A1A",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 4,
                color: "#F5F5F0",
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full px-4">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span
              className="shrink-0 rounded-full"
              style={{ width: 10, height: 10, background: d.color }}
            />
            <span className="font-sans text-xs" style={{ color: "rgba(245,245,240,0.55)" }}>
              {d.name}
            </span>
            <span
              className="ml-auto font-sans text-xs font-semibold"
              style={{ color: d.color === "rgba(245,245,240,0.15)" ? "rgba(245,245,240,0.4)" : d.color }}
            >
              {d.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Center label */}
      <p
        className="font-sans text-xs tracking-widest uppercase text-center"
        style={{ color: "rgba(245,245,240,0.3)" }}
      >
        Visitor Origin Mix
      </p>
    </div>
  );
}
