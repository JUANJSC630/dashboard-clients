"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IncidentStatus, IncidentPriority } from "@prisma/client";

type IncidentSummary = {
  id: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  type: string;
  createdAt: Date;
};

export function IncidentsChart({ incidents }: { incidents: IncidentSummary[] }) {
  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const inc of incidents) {
      counts[inc.type] = (counts[inc.type] ?? 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [incidents]);

  const byMonth = useMemo(() => {
    const counts: Record<string, { open: number; resolved: number }> = {};
    for (const inc of incidents) {
      const key = new Date(inc.createdAt).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!counts[key]) counts[key] = { open: 0, resolved: 0 };
      if (inc.status === "RESOLVED") counts[key].resolved += 1;
      else counts[key].open += 1;
    }
    return Object.entries(counts)
      .map(([month, v]) => ({ month, ...v }))
      .slice(-6);
  }, [incidents]);

  return (
    <div className="bg-background rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Incidents by Type</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byType}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="type" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h3 className="text-lg font-semibold mb-4 mt-6">Incidents per Month</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byMonth}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" fill="#ef4444" radius={[4, 4, 0, 0]} name="Open" />
            <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
