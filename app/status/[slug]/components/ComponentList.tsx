import { SiteStatus } from "@prisma/client";

type ComponentSite = {
  id: string;
  name: string;
  status: SiteStatus;
  uptimePercent: number | null;
  lastCheckedAt: Date | null;
};

type StatusComponent = {
  id: string;
  displayName: string;
  description: string | null;
  site: ComponentSite | null;
};

const statusConfig: Record<
  SiteStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  ACTIVE: {
    label: "Operational",
    dotColor: "bg-[#10b981]",
    textColor: "text-[#059669] dark:text-[#6ee7b7]",
  },
  DOWN: {
    label: "Major Outage",
    dotColor: "bg-[#ef4444]",
    textColor: "text-[#dc2626] dark:text-[#fca5a5]",
  },
  MAINTENANCE: {
    label: "Under Maintenance",
    dotColor: "bg-[#3b82f6]",
    textColor: "text-[#2563eb] dark:text-[#93c5fd]",
  },
  PAUSED: {
    label: "Degraded",
    dotColor: "bg-[#f59e0b]",
    textColor: "text-[#d97706] dark:text-[#fcd34d]",
  },
};

export function ComponentList({
  components,
}: {
  components: StatusComponent[];
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] dark:border-[#1f2937] bg-white dark:bg-[#111318] overflow-hidden">
      {components.map((comp, i) => {
        const siteStatus = comp.site?.status ?? "PAUSED";
        const cfg = statusConfig[siteStatus];

        return (
          <div
            key={comp.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i < components.length - 1
                ? "border-b border-[#f3f4f6] dark:border-[#1f2937]"
                : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-[#111827] dark:text-white">
                {comp.displayName}
              </p>
              {comp.description && (
                <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-0.5">
                  {comp.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${cfg.textColor}`}>
                {cfg.label}
              </span>
              <span
                className={`size-2.5 rounded-full ${cfg.dotColor}`}
                aria-label={cfg.label}
              />
            </div>
          </div>
        );
      })}

      {components.length === 0 && (
        <div className="px-6 py-8 text-center text-sm text-[#6b7280]">
          No components configured.
        </div>
      )}
    </div>
  );
}
