import { IncidentUpdateStatus } from "@prisma/client";

type IncidentUpdate = {
  id: string;
  status: IncidentUpdateStatus;
  message: string;
  createdAt: Date;
};

type PastIncident = {
  id: string;
  title: string;
  createdAt: Date;
  resolvedAt: Date | null;
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

function groupByDay(incidents: PastIncident[]) {
  const groups: Record<string, PastIncident[]> = {};

  for (const inc of incidents) {
    const dateStr = new Date(inc.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(inc);
  }

  return Object.entries(groups);
}

export function PastIncidents({ incidents }: { incidents: PastIncident[] }) {
  const grouped = groupByDay(incidents);

  // Build the last 14 days for display
  const groupedMap = new Map(grouped);
  const days: { label: string; incidents: PastIncident[] }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    days.push({ label, incidents: groupedMap.get(label) ?? [] });
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] uppercase tracking-wider mb-6">
        Past Incidents
      </h2>

      <div className="space-y-0">
        {days.map((day) => (
          <div
            key={day.label}
            className="border-t border-[#e5e7eb] dark:border-[#1f2937] py-5"
          >
            <h3 className="text-sm font-semibold text-[#111827] dark:text-white mb-3">
              {day.label}
            </h3>

            {day.incidents.length === 0 ? (
              <p className="text-xs text-[#9ca3af]">No incidents reported.</p>
            ) : (
              <div className="space-y-5">
                {day.incidents.map((inc) => (
                  <div key={inc.id}>
                    <p className="text-sm font-medium text-[#111827] dark:text-white">
                      {inc.title}
                    </p>
                    <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mb-2">
                      {inc.site.name}
                    </p>

                    {inc.updates.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-[#e5e7eb] dark:border-[#374151]">
                        {inc.updates.map((upd) => (
                          <div key={upd.id}>
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
                                {new Date(upd.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZoneName: "short",
                                  },
                                )}
                              </time>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
