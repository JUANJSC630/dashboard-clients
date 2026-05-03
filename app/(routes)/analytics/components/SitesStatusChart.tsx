"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SiteStatus } from "@prisma/client";

type SiteSummary = { id: string; status: SiteStatus; platform: string };

const STATUS_COLORS: Record<SiteStatus, string> = {
  ACTIVE: "#22c55e",
  PAUSED: "#eab308",
  DOWN: "#ef4444",
  MAINTENANCE: "#3b82f6",
};

export function SitesStatusChart({ sites }: { sites: SiteSummary[] }) {
  const statusData = useMemo(() => {
    const counts: Partial<Record<SiteStatus, number>> = {};
    for (const s of sites) {
      counts[s.status] = (counts[s.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [sites]);

  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sites) {
      counts[s.platform] = (counts[s.platform] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sites]);

  const PLATFORM_COLORS = [
    "#000000",
    "#7c3aed",
    "#14b8a6",
    "#16a34a",
    "#7c3aed",
    "#f97316",
    "#6366f1",
    "#3b82f6",
    "#64748b",
  ];

  return (
    <div className="bg-background rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Sites by Status</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {statusData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={
                    STATUS_COLORS[entry.name as SiteStatus] ??
                    PLATFORM_COLORS[i % PLATFORM_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h3 className="text-lg font-semibold mb-4 mt-6">Sites by Platform</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {platformData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
