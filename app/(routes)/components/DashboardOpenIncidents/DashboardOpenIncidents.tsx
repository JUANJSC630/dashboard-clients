import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { IncidentStatus } from "@prisma/client";

const statusVariant: Record<
  IncidentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "destructive",
  IN_PROGRESS: "outline",
  RESOLVED: "default",
};

export async function DashboardOpenIncidents({ userId }: { userId: string }) {
  const incidents = await db.incident.findMany({
    where: { userId, status: { not: "RESOLVED" } },
    include: { site: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="bg-background rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Open Incidents</h3>
        <Link
          href="/incidents"
          className="text-xs text-blue-500 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="divide-y">
        {incidents.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No open incidents.
          </p>
        ) : (
          incidents.map((inc) => (
            <Link
              key={inc.id}
              href={`/sites/${inc.site.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {inc.title}
                </p>
                <p className="text-xs text-muted-foreground">{inc.site.name}</p>
              </div>
              <Badge variant={statusVariant[inc.status]}>{inc.status}</Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
