import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncidentPriority, IncidentStatus } from "@prisma/client";
import { DataFilters } from "@/components/DataFilters";
import { LayoutList, Layers } from "lucide-react";
import { IncidentsExportButton } from "./components/IncidentsExportButton";

const statusVariant: Record<
  IncidentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "destructive",
  IN_PROGRESS: "outline",
  RESOLVED: "default",
};

const priorityColor: Record<IncidentPriority, string> = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600 font-semibold",
};

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

type IncidentWithSite = Awaited<
  ReturnType<typeof db.incident.findMany>
>[number] & { site: { id: string; name: string } };

function IncidentRow({ inc }: { inc: IncidentWithSite }) {
  return (
    <tr key={inc.id} className="border-b last:border-0 hover:bg-muted/30">
      <td className="p-4 font-medium max-w-[240px] truncate">{inc.title}</td>
      <td className="p-4">
        <Link
          href={`/sites/${inc.site.id}`}
          className="hover:underline text-muted-foreground"
        >
          {inc.site.name}
        </Link>
      </td>
      <td className="p-4 text-muted-foreground">{inc.type}</td>
      <td className={`p-4 ${priorityColor[inc.priority]}`}>{inc.priority}</td>
      <td className="p-4">
        <Badge variant={statusVariant[inc.status]}>{inc.status}</Badge>
      </td>
      <td className="p-4 text-muted-foreground" suppressHydrationWarning>
        {new Date(inc.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

export const metadata = {
  title: "Incidents — Hosting Dashboard",
  description: "Track and resolve incidents across all your sites",
};

const tableHead = (
  <thead>
    <tr className="border-b">
      <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
      <th className="text-left p-4 font-medium text-muted-foreground">Site</th>
      <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
      <th className="text-left p-4 font-medium text-muted-foreground">
        Priority
      </th>
      <th className="text-left p-4 font-medium text-muted-foreground">
        Status
      </th>
      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
    </tr>
  </thead>
);

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; group?: string }>;
}) {
  const [{ userId }, { status, priority, group }] = await Promise.all([
    auth(),
    searchParams,
  ]);
  if (!userId) return redirect("/");

  const grouped = group === "site";

  const allIncidents = await db.incident.findMany({
    where: { userId },
    include: { site: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const open = allIncidents.filter((i) => i.status === "OPEN");
  const inProgress = allIncidents.filter((i) => i.status === "IN_PROGRESS");
  const resolved = allIncidents.filter((i) => i.status === "RESOLVED");
  const critical = allIncidents.filter(
    (i) => i.priority === "CRITICAL" && i.status !== "RESOLVED",
  );

  const incidents = allIncidents.filter((i) => {
    if (status && i.status !== (status as IncidentStatus)) return false;
    if (priority && i.priority !== (priority as IncidentPriority)) return false;
    return true;
  });

  // Group by site
  const bySite = grouped
    ? incidents.reduce<
        Record<
          string,
          { siteName: string; siteId: string; items: typeof incidents }
        >
      >((acc, inc) => {
        if (!acc[inc.site.id]) {
          acc[inc.site.id] = {
            siteName: inc.site.name,
            siteId: inc.site.id,
            items: [],
          };
        }
        acc[inc.site.id].items.push(inc);
        return acc;
      }, {})
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Incidents</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and resolve issues across all your sites
          </p>
        </div>
        <IncidentsExportButton
          rows={incidents.map((i) => ({
            title: i.title,
            site: i.site.name,
            type: i.type,
            priority: i.priority,
            status: i.status,
            // react-doctor-disable-next-line react-doctor/rendering-hydration-mismatch-time
            createdAt: new Date(i.createdAt).toLocaleDateString(),
            // react-doctor-disable-next-line react-doctor/rendering-hydration-mismatch-time
            resolvedAt: i.resolvedAt
              ? new Date(i.resolvedAt).toLocaleDateString()
              : "",
          }))}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-destructive">{open.length}</p>
          <p className="text-sm text-muted-foreground">Open</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {inProgress.length}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{resolved.length}</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{critical.length}</p>
          <p className="text-sm text-muted-foreground">Critical Open</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Suspense
          fallback={
            <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          }
        >
          <DataFilters
            showSearch={false}
            filters={[
              { key: "status", placeholder: "Status", options: STATUS_OPTIONS },
              {
                key: "priority",
                placeholder: "Priority",
                options: PRIORITY_OPTIONS,
              },
            ]}
          />
        </Suspense>
        <div className="flex items-center gap-1 ml-auto">
          <Link
            href={`/incidents?${new URLSearchParams({ ...(status ? { status } : {}), ...(priority ? { priority } : {}) }).toString()}`}
          >
            <Button variant={grouped ? "ghost" : "secondary"} size="sm">
              <LayoutList className="size-4 mr-1" /> List
            </Button>
          </Link>
          <Link
            href={`/incidents?${new URLSearchParams({ ...(status ? { status } : {}), ...(priority ? { priority } : {}), group: "site" }).toString()}`}
          >
            <Button variant={grouped ? "secondary" : "ghost"} size="sm">
              <Layers className="size-4 mr-1" /> By Site
            </Button>
          </Link>
        </div>
      </div>

      {grouped && bySite ? (
        <div className="flex flex-col gap-4">
          {Object.keys(bySite).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No incidents match the current filters.
            </p>
          )}
          {Object.values(bySite).map((group) => (
            <div
              key={group.siteId}
              className="bg-background rounded-lg border shadow-sm"
            >
              <div className="flex items-center gap-2 p-4 border-b">
                <Link
                  href={`/sites/${group.siteId}`}
                  className="font-semibold hover:underline"
                >
                  {group.siteName}
                </Link>
                <Badge variant="outline" className="text-xs">
                  {group.items.length}
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {tableHead}
                  <tbody>
                    {group.items.map((inc) => (
                      <IncidentRow key={inc.id} inc={inc} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-background rounded-lg border shadow-sm">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              {tableHead}
              <tbody>
                {incidents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      {allIncidents.length === 0
                        ? "No incidents recorded. Add them from the site detail page."
                        : "No incidents match the current filters."}
                    </td>
                  </tr>
                )}
                {incidents.map((inc) => (
                  <IncidentRow key={inc.id} inc={inc} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y">
            {incidents.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {allIncidents.length === 0
                  ? "No incidents recorded."
                  : "No incidents match the current filters."}
              </p>
            )}
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm truncate max-w-[200px]">
                    {inc.title}
                  </p>
                  <Badge
                    variant={statusVariant[inc.status]}
                    className="text-xs shrink-0"
                  >
                    {inc.status}
                  </Badge>
                </div>
                <Link
                  href={`/sites/${inc.site.id}`}
                  className="text-xs text-muted-foreground hover:underline block"
                >
                  {inc.site.name}
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{inc.type}</span>
                  <span className={priorityColor[inc.priority]}>
                    {inc.priority}
                  </span>
                  <span suppressHydrationWarning>
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
