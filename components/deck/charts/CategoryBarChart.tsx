"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const DATA = [
  { cat: "Fashion",      pct: 35, color: "#C9A84C" },
  { cat: "Dining",       pct: 20, color: "#E8C97A" },
  { cat: "Services",     pct: 18, color: "#B8953C" },
  { cat: "Entertainment",pct: 15, color: "#D4B55A" },
  { cat: "Luxury",       pct: 12, color: "#A07830" },
];

interface Props { isActive: boolean }

export default function CategoryBarChart({ isActive }: Props) {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (!mounted) setMounted(true);
    const t = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(t);
  }, [isActive, mounted]);

  if (!mounted) return <div style={{ height: 220 }} />;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DATA}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            type="number"
            domain={[0, 40]}
            hide
          />
          <YAxis
            type="category"
            dataKey="cat"
            width={90}
            tick={{
              fill: "rgba(245,245,240,0.5)",
              fontSize: 11,
              fontFamily: "Inter, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Bar
            dataKey="pct"
            radius={[0, 3, 3, 0]}
            isAnimationActive={animate}
            animationBegin={0}
            animationDuration={1000}
            background={{ fill: "rgba(245,245,240,0.04)", radius: 3 }}
          >
            {DATA.map((entry) => (
              <Cell key={entry.cat} fill={entry.color} />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v) => `${v}%`}
              style={{
                fill: "rgba(245,245,240,0.5)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
