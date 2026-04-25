"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";

const DATA = [
  { type: "Brand Activation", capacity: 50000, color: "#C9A84C" },
  { type: "Sports Championship", capacity: 15000, color: "#E8C97A" },
  { type: "Concert / Show",   capacity: 7000,  color: "#B8953C" },
  { type: "Corporate Event",  capacity: 3000,  color: "#D4B55A" },
  { type: "Pop-Up Activation",capacity: 1200,  color: "#A07830" },
];

interface Props { isActive: boolean }

export default function EventCapacityChart({ isActive }: Props) {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (!mounted) setMounted(true);
    const t = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(t);
  }, [isActive, mounted]);

  if (!mounted) return <div style={{ height: 200 }} />;

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DATA}
          layout="vertical"
          margin={{ top: 0, right: 80, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <XAxis type="number" domain={[0, 55000]} hide />
          <YAxis
            type="category"
            dataKey="type"
            width={110}
            tick={{
              fill: "rgba(245,245,240,0.45)",
              fontSize: 10,
              fontFamily: "Inter, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1A1A1A",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 4,
              color: "#F5F5F0",
              fontSize: 11,
              fontFamily: "Inter, sans-serif",
            }}
            formatter={(v) => [Number(v).toLocaleString() + " capacity", ""]}
            cursor={{ fill: "rgba(245,245,240,0.03)" }}
          />
          <Bar
            dataKey="capacity"
            radius={[0, 3, 3, 0]}
            isAnimationActive={animate}
            animationBegin={0}
            animationDuration={1000}
            background={{ fill: "rgba(245,245,240,0.04)", radius: 3 }}
          >
            {DATA.map((entry) => (
              <Cell key={entry.type} fill={entry.color} />
            ))}
            <LabelList
              dataKey="capacity"
              position="right"
              formatter={(v) => {
                const n = Number(v);
                return n >= 1000 ? `${(n / 1000).toFixed(0)}K+` : `${n}+`;
              }}
              style={{
                fill: "rgba(245,245,240,0.5)",
                fontSize: 10,
                fontFamily: "Inter, sans-serif",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
