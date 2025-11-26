"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  month: string;
  placements: number;
  revenue: number;
}

interface AnalyticsLineChartProps {
  data: DataPoint[];
  title?: string;
}

const COLORS = {
  primary: "#3b82f6",
  accent: "#8b5cf6",
};

const formatCurrency = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

export function AnalyticsLineChart({ data, title }: AnalyticsLineChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-secondary-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatCurrency}
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
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [formatCurrency(value), "Revenue"];
              }
              return [value, "Placements"];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="placements"
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={{ fill: COLORS.primary, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: COLORS.primary }}
            name="Placements"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke={COLORS.accent}
            strokeWidth={2}
            dot={{ fill: COLORS.accent, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: COLORS.accent }}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsLineChart;
