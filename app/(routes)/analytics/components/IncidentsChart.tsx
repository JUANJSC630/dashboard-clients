"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border rounded-lg px-3 py-2 shadow-sm">
      <p className="text-xs font-medium mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="size-2 rounded-full inline-block shrink-0"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function IncidentsChart({
  incidents,
}: {
  incidents: IncidentSummary[];
}) {
  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const inc of incidents) {
      counts[inc.type] = (counts[inc.type] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
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

  const total = incidents.length;
  const hasData = total > 0;

  return (
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Incident Analysis</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total} {total === 1 ? "incident" : "incidents"} total
        </p>
      </div>

      {/* Per Month bar chart */}
      <div className="px-5 py-5 border-b">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
          Per Month
        </p>
        {!hasData ? (
          <div className="h-[160px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No incidents recorded</p>
          </div>
        ) : (
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byMonth}
                barSize={14}
                barCategoryGap="30%"
                margin={{ top: 0, right: 0, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                />
                <Bar
                  dataKey="open"
                  fill="#ef4444"
                  radius={[3, 3, 0, 0]}
                  name="Open"
                />
                <Bar
                  dataKey="resolved"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                  name="Resolved"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {hasData && (
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-[#ef4444] inline-block" />
              Open
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-[#10b981] inline-block" />
              Resolved
            </div>
          </div>
        )}
      </div>

      {/* By Type */}
      <div className="px-5 py-5">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
          By Type
        </p>
        {!hasData || byType.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No incidents recorded
          </p>
        ) : (
          <div className="space-y-3.5">
            {byType.map(({ type, count }) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              const label = type
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground">{label}</span>
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/60 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
