import { Wrench, Calendar } from "lucide-react";
import { MaintenanceStatus } from "@prisma/client";

type Maintenance = {
  id: string;
  title: string;
  description: string | null;
  status: MaintenanceStatus;
  startsAt: Date;
  endsAt: Date;
};

export function ScheduledMaintenanceBanner({
  maintenances,
}: {
  maintenances: Maintenance[];
}) {
  return (
    <div className="space-y-3">
      {maintenances.map((m) => {
        const isActive = m.status === "IN_PROGRESS";

        return (
          <div
            key={m.id}
            className={`rounded-xl border px-5 py-4 ${
              isActive
                ? "border-[#bfdbfe] dark:border-[#1e40af] bg-[#eff6ff] dark:bg-[#172554]"
                : "border-[#e5e7eb] dark:border-[#374151] bg-[#f9fafb] dark:bg-[#111318]"
            }`}
          >
            <div className="flex items-start gap-3">
              {isActive ? (
                <Wrench className="size-4 text-[#3b82f6] shrink-0 mt-0.5" />
              ) : (
                <Calendar className="size-4 text-[#6b7280] shrink-0 mt-0.5" />
              )}
              <div>
                <h4
                  className={`text-sm font-semibold ${
                    isActive
                      ? "text-[#1e40af] dark:text-[#93c5fd]"
                      : "text-[#374151] dark:text-[#d1d5db]"
                  }`}
                >
                  {isActive ? "Maintenance in progress: " : "Scheduled: "}
                  {m.title}
                </h4>
                {m.description && (
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-1">
                    {m.description}
                  </p>
                )}
                <p className="text-xs text-[#9ca3af] mt-1" suppressHydrationWarning>
                  <time
                    dateTime={new Date(m.startsAt).toISOString()}
                    suppressHydrationWarning
                  >
                    {new Date(m.startsAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  {" → "}
                  <time
                    dateTime={new Date(m.endsAt).toISOString()}
                    suppressHydrationWarning
                  >
                    {new Date(m.endsAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </time>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
