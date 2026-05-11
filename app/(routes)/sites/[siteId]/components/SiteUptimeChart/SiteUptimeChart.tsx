"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type PingLog = {
  isUp: boolean;
  latencyMs: number | null;
  checkedAt: Date | string;
};

export function SiteUptimeChart({ pingLogs }: { pingLogs: PingLog[] }) {
  const data = pingLogs
    .slice()
    .reverse()
    .map((log) => ({
      time: new Date(log.checkedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      latency: log.latencyMs ?? 0,
      status: log.isUp ? 1 : 0,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-background rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Uptime & Latency</h3>
        <p className="text-sm text-muted-foreground">
          No ping data available yet. Data will appear after the next health
          check.
        </p>
      </div>
    );
  }

  const avgLatency = Math.round(
    data.reduce((sum, d) => sum + d.latency, 0) / data.length,
  );
  const upCount = data.filter((d) => d.status === 1).length;
  const uptimePercent = ((upCount / data.length) * 100).toFixed(1);

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Uptime & Latency</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Uptime:{" "}
            <strong className="text-foreground">{uptimePercent}%</strong>
          </span>
          <span>
            Avg:{" "}
            <strong className="text-foreground">{avgLatency}ms</strong>
          </span>
        </div>
      </div>

      <div className="h-48" suppressHydrationWarning>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              unit="ms"
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}ms`, "Latency"]}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="hsl(var(--primary))"
              fill="url(#latencyGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status dots */}
      <div className="flex gap-0.5 mt-3">
        {data.map((d) => (
          <div
            key={d.time}
            className={`h-2 flex-1 rounded-sm ${
              d.status === 1 ? "bg-green-500" : "bg-red-500"
            }`}
            title={`${d.time}: ${d.status === 1 ? "UP" : "DOWN"} (${d.latency}ms)`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{data[0]?.time}</span>
        <span>Last {data.length} checks</span>
        <span>{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}
