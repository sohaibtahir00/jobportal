"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  week: string;
  candidates: number;
  employers: number;
}

interface AnalyticsAreaChartProps {
  data: DataPoint[];
  title?: string;
}

const COLORS = {
  primary: "#3b82f6",
  accent: "#8b5cf6",
};

export function AnalyticsAreaChart({ data, title }: AnalyticsAreaChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-secondary-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="candidates"
            stroke={COLORS.primary}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCandidates)"
            name="Candidates"
          />
          <Area
            type="monotone"
            dataKey="employers"
            stroke={COLORS.accent}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEmployers)"
            name="Employers"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsAreaChart;
