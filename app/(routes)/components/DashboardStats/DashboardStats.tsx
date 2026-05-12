import Link from "next/link";
import { Globe, Users, AlertTriangle, DollarSign } from "lucide-react";
import { db } from "@/lib/db";

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const [
    totalSites,
    totalClients,
    totalOpenIncidents,
    totalOverdue,
    activeSites,
  ] = await Promise.all([
    db.site.count({ where: { userId } }),
    db.client.count({ where: { userId } }),
    db.incident.count({ where: { userId, status: { not: "RESOLVED" } } }),
    db.billing.count({ where: { userId, status: "OVERDUE" } }),
    db.site.count({ where: { userId, status: "ACTIVE" } }),
  ]);

  const stats = [
    {
      icon: Globe,
      label: "Sites",
      value: totalSites,
      sub: `${activeSites} active`,
      href: "/sites",
      alert: false,
    },
    {
      icon: Users,
      label: "Clients",
      value: totalClients,
      sub: "total",
      href: "/clients",
      alert: false,
    },
    {
      icon: AlertTriangle,
      label: "Open Incidents",
      value: totalOpenIncidents,
      sub: "unresolved",
      href: "/incidents",
      alert: totalOpenIncidents > 0,
    },
    {
      icon: DollarSign,
      label: "Overdue Bills",
      value: totalOverdue,
      sub: "past due",
      href: "/billing",
      alert: totalOverdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, sub, href, alert }) => (
        <Link
          key={href}
          href={href}
          className="group bg-background rounded-xl p-5 border hover:border-foreground/20 transition-colors duration-150"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <Icon
              className="size-3.5 text-muted-foreground/40 mt-0.5"
              strokeWidth={1.75}
            />
          </div>
          <p
            className={`text-3xl font-bold tracking-tight tabular-nums ${alert ? "text-destructive" : ""}`}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1.5">{sub}</p>
        </Link>
      ))}
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-background rounded-xl p-5 border space-y-4">
          <div className="flex items-start justify-between">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-3 w-3 bg-muted rounded" />
          </div>
          <div className="h-9 w-12 bg-muted rounded" />
          <div className="h-3 w-14 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
