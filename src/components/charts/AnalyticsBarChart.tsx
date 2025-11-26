"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  niche: string;
  count: number;
}

interface AnalyticsBarChartProps {
  data: DataPoint[];
  title?: string;
}

const NICHE_COLORS: Record<string, string> = {
  "AI/ML": "#3b82f6",
  "Healthcare IT": "#22c55e",
  "Fintech": "#f59e0b",
  "Cybersecurity": "#ef4444",
  "Other": "#6b7280",
};

export function AnalyticsBarChart({ data, title }: AnalyticsBarChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-secondary-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="niche"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#e5e7eb" }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
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
            formatter={(value: number) => [value, "Candidates"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={NICHE_COLORS[entry.niche] || NICHE_COLORS["Other"]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsBarChart;
