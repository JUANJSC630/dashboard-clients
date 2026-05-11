import { IncidentUpdateStatus } from "@prisma/client";
import { AlertTriangle } from "lucide-react";

type IncidentUpdate = {
  id: string;
  status: IncidentUpdateStatus;
  message: string;
  createdAt: Date;
};

type ActiveIncident = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  site: { name: string };
  updates: IncidentUpdate[];
};

const updateStatusLabel: Record<IncidentUpdateStatus, string> = {
  INVESTIGATING: "Investigating",
  IDENTIFIED: "Identified",
  MONITORING: "Monitoring",
  RESOLVED: "Resolved",
};

const updateStatusColor: Record<IncidentUpdateStatus, string> = {
  INVESTIGATING: "text-[#f59e0b]",
  IDENTIFIED: "text-[#f97316]",
  MONITORING: "text-[#3b82f6]",
  RESOLVED: "text-[#10b981]",
};

export function ActiveIncidents({
  incidents,
}: {
  incidents: ActiveIncident[];
}) {
  return (
    <div className="space-y-4">
      {incidents.map((inc) => (
        <div
          key={inc.id}
          className="rounded-xl border border-[#fecaca] dark:border-[#991b1b] bg-[#fef2f2] dark:bg-[#450a0a] p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="size-5 text-[#ef4444] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#991b1b] dark:text-[#fca5a5]">
                {inc.title}
              </h3>
              <p className="text-xs text-[#b91c1c] dark:text-[#fca5a5]/70 mt-0.5">
                Affecting {inc.site.name}
              </p>
            </div>
          </div>

          {inc.updates.length > 0 && (
            <div className="space-y-3 pl-8">
              {inc.updates.map((upd) => (
                <div key={upd.id} className="relative pl-4 border-l-2 border-[#fecaca] dark:border-[#7f1d1d]">
                  <p className="text-xs">
                    <span
                      className={`font-semibold ${updateStatusColor[upd.status]}`}
                    >
                      {updateStatusLabel[upd.status]}
                    </span>
                    <span className="text-[#6b7280] dark:text-[#9ca3af]">
                      {" — "}
                      {upd.message}
                    </span>
                  </p>
                  <p
                    className="text-[10px] text-[#9ca3af] mt-0.5"
                    suppressHydrationWarning
                  >
                    <time
                      dateTime={new Date(upd.createdAt).toISOString()}
                      suppressHydrationWarning
                    >
                      {new Date(upd.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })}
                    </time>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
