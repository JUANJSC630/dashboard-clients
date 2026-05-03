import Link from "next/link";
import { Globe, Users, AlertTriangle, DollarSign } from "lucide-react";
import { db } from "@/lib/db";

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const [totalSites, totalClients, totalOpenIncidents, totalOverdue, activeSites] =
    await Promise.all([
      db.site.count({ where: { userId } }),
      db.client.count({ where: { userId } }),
      db.incident.count({ where: { userId, status: { not: "RESOLVED" } } }),
      db.billing.count({ where: { userId, status: "OVERDUE" } }),
      db.site.count({ where: { userId, status: "ACTIVE" } }),
    ]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-background rounded-lg p-5 border shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">Sites</span>
        </div>
        <p className="text-2xl font-bold">{totalSites}</p>
        <p className="text-xs text-muted-foreground mt-1">{activeSites} active</p>
      </div>
      <div className="bg-background rounded-lg p-5 border shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">Clients</span>
        </div>
        <p className="text-2xl font-bold">{totalClients}</p>
      </div>
      <div className="bg-background rounded-lg p-5 border shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Open Incidents</span>
        </div>
        <p
          className={`text-2xl font-bold ${totalOpenIncidents > 0 ? "text-destructive" : ""}`}
        >
          {totalOpenIncidents}
        </p>
      </div>
      <div className="bg-background rounded-lg p-5 border shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">Overdue Bills</span>
        </div>
        <p
          className={`text-2xl font-bold ${totalOverdue > 0 ? "text-destructive" : ""}`}
        >
          {totalOverdue}
        </p>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-background rounded-lg p-5 border shadow-sm space-y-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-12 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
