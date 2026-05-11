"use client";

import { SiteStatus } from "@prisma/client";

type PingLog = {
  isUp: boolean;
  latencyMs: number | null;
  checkedAt: Date | string;
};

type ComponentSite = {
  id: string;
  name: string;
  status: SiteStatus;
  uptimePercent: number | null;
  pingLogs: PingLog[];
};

type StatusComponent = {
  id: string;
  displayName: string;
  site: ComponentSite | null;
};

function buildDayBuckets(pingLogs: PingLog[], days: number) {
  const buckets: { date: string; up: number; total: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    buckets.push({ date: dateStr, up: 0, total: 0 });
  }

  for (const log of pingLogs) {
    const dateStr = new Date(log.checkedAt).toISOString().split("T")[0];
    const bucket = buckets.find((b) => b.date === dateStr);
    if (bucket) {
      bucket.total++;
      if (log.isUp) bucket.up++;
    }
  }

  return buckets;
}

function getBarColor(up: number, total: number): string {
  if (total === 0) return "bg-[#e5e7eb] dark:bg-[#374151]"; // no data
  const pct = (up / total) * 100;
  if (pct >= 99) return "bg-[#10b981]"; // green
  if (pct >= 95) return "bg-[#f59e0b]"; // yellow
  if (pct >= 80) return "bg-[#f97316]"; // orange
  return "bg-[#ef4444]"; // red
}

function DayBar({
  date,
  up,
  total,
}: {
  date: string;
  up: number;
  total: number;
}) {
  const pct = total > 0 ? ((up / total) * 100).toFixed(1) : "—";
  const color = getBarColor(up, total);

  return (
    <div className="group relative flex-1 min-w-0">
      <div
        className={`h-8 rounded-[2px] ${color} transition-opacity group-hover:opacity-80`}
      />
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-[#1f2937] dark:bg-white text-white dark:text-[#111827] text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <p className="font-medium">
            {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
          {total > 0 ? (
            <p>
              {pct}% uptime · {total} checks
            </p>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function UptimeBars({
  components,
}: {
  components: StatusComponent[];
}) {
  const DAYS = 90;

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider">
        Uptime over the past {DAYS} days
      </h2>

      {components.map((comp) => {
        const pings = comp.site?.pingLogs ?? [];
        const buckets = buildDayBuckets(pings, DAYS);
        const totalUp = buckets.reduce((s, b) => s + b.up, 0);
        const totalChecks = buckets.reduce((s, b) => s + b.total, 0);
        const overallPct =
          totalChecks > 0 ? ((totalUp / totalChecks) * 100).toFixed(2) : "—";

        return (
          <div key={comp.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111827] dark:text-white">
                {comp.displayName}
              </span>
              <span className="text-xs font-medium text-[#6b7280] dark:text-[#9ca3af]">
                {overallPct}% uptime
              </span>
            </div>
            <div className="flex gap-[1px]">
              {buckets.map((b) => (
                <DayBar key={b.date} date={b.date} up={b.up} total={b.total} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#9ca3af]">{DAYS} days ago</span>
              <span className="text-[10px] text-[#9ca3af]">Today</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
