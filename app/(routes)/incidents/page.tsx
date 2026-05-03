import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { IncidentPriority, IncidentStatus } from "@prisma/client";
import { DataFilters } from "@/components/DataFilters";

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

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { status, priority } = await searchParams;

  // Fetch all for stats cards (global totals), apply filters only to the table
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

  // Apply client-side filters for table (avoids a second DB round-trip)
  const incidents = allIncidents.filter((i) => {
    if (status && i.status !== (status as IncidentStatus)) return false;
    if (priority && i.priority !== (priority as IncidentPriority)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Incidents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track and resolve issues across all your sites
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-destructive">{open.length}</p>
          <p className="text-sm text-muted-foreground">Open</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{inProgress.length}</p>
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

      <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse" />}>
        <DataFilters
          showSearch={false}
          filters={[
            { key: "status", placeholder: "Status", options: STATUS_OPTIONS },
            { key: "priority", placeholder: "Priority", options: PRIORITY_OPTIONS },
          ]}
        />
      </Suspense>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Site</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {allIncidents.length === 0
                      ? "No incidents recorded. Add them from the site detail page."
                      : "No incidents match the current filters."}
                  </td>
                </tr>
              )}
              {incidents.map((inc) => (
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
                  <td className="p-4 text-muted-foreground">
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
