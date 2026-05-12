"use client";

import { useMemo } from "react";
import { SiteStatus } from "@prisma/client";

type SiteSummary = { id: string; status: SiteStatus; platform: string };

const STATUS_CONFIG: Record<SiteStatus, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "#10b981" },
  PAUSED: { label: "Paused", color: "#f59e0b" },
  DOWN: { label: "Down", color: "#ef4444" },
  MAINTENANCE: { label: "Maintenance", color: "#6366f1" },
};

export function SitesStatusChart({ sites }: { sites: SiteSummary[] }) {
  const total = sites.length;

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<SiteStatus, number>> = {};
    for (const s of sites) {
      counts[s.status] = (counts[s.status] ?? 0) + 1;
    }
    return counts;
  }, [sites]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sites) {
      counts[s.platform] = (counts[s.platform] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sites]);

  return (
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Site Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total} {total === 1 ? "site" : "sites"} total
        </p>
      </div>

      {/* By Status */}
      <div className="px-5 py-5 border-b">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
          By Status
        </p>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No sites yet
          </p>
        ) : (
          <div className="space-y-3.5">
            {(Object.entries(STATUS_CONFIG) as [SiteStatus, { label: string; color: string }][]).map(
              ([status, { label, color }]) => {
                const count = statusCounts[status] ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full inline-block shrink-0"
                          style={{
                            backgroundColor: color,
                            opacity: count === 0 ? 0.3 : 1,
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color:
                              count === 0
                                ? "hsl(var(--muted-foreground))"
                                : "hsl(var(--foreground))",
                            opacity: count === 0 ? 0.5 : 1,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: count === 0 ? "100%" : `${pct}%`,
                          backgroundColor:
                            count === 0
                              ? "hsl(var(--muted))"
                              : color,
                          opacity: count === 0 ? 0.3 : 1,
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* By Platform */}
      <div className="px-5 py-5">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
          By Platform
        </p>
        {platformCounts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No sites yet
          </p>
        ) : (
          <div className="space-y-3.5">
            {platformCounts.map(([platform, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={platform}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground">{platform}</span>
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
