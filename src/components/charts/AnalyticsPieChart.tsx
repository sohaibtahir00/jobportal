"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PieLabelRenderProps } from "recharts";

interface DataPoint {
  status: string;
  count: number;
  [key: string]: string | number;
}

interface AnalyticsPieChartProps {
  data: DataPoint[];
  title?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Applied: "#6b7280",
  Shortlisted: "#3b82f6",
  Interviewing: "#8b5cf6",
  Offered: "#f59e0b",
  Hired: "#22c55e",
  Rejected: "#ef4444",
  Withdrawn: "#9ca3af",
};

const renderLabel = (props: PieLabelRenderProps): string => {
  const percent = typeof props.percent === 'number' ? props.percent : 0;
  return percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : "";
};

export function AnalyticsPieChart({ data, title }: AnalyticsPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-secondary-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => [
              `${value} (${((value / total) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-sm text-secondary-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsPieChart;
