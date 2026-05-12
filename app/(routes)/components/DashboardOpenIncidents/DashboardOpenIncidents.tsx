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
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Open Incidents</h3>
        <Link
          href="/incidents"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          View all
        </Link>
      </div>
      <div className="divide-y flex-1">
        {incidents.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No open incidents — all clear.
            </p>
          </div>
        ) : (
          incidents.map((inc) => (
            <Link
              key={inc.id}
              href={`/sites/${inc.site.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {inc.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inc.site.name}
                </p>
              </div>
              <Badge variant={statusVariant[inc.status]}>{inc.status}</Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
