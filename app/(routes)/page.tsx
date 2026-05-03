import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe, Users, AlertTriangle, DollarSign } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { BillingStatus, IncidentStatus, SiteStatus } from "@prisma/client";

const statusVariant: Record<
  SiteStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  DOWN: "destructive",
  MAINTENANCE: "outline",
};

const billingStatusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

const incidentStatusVariant: Record<
  IncidentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "destructive",
  IN_PROGRESS: "outline",
  RESOLVED: "default",
};

export default async function Home() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [sites, clients, openIncidents, upcomingBillings] = await Promise.all([
    db.site.findMany({
      where: { userId },
      select: { id: true, name: true, status: true, platform: true, url: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.client.findMany({
      where: { userId },
      select: { id: true, firstName: true, lastName: true, businessName: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.incident.findMany({
      where: { userId, status: { not: "RESOLVED" } },
      include: { site: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.billing.findMany({
      where: {
        userId,
        status: { not: "PAID" },
        nextDueDate: { lte: in30Days },
      },
      include: { site: { select: { id: true, name: true } } },
      orderBy: { nextDueDate: "asc" },
      take: 5,
    }),
  ]);

  const [totalSites, totalClients, totalOpenIncidents, totalOverdue] =
    await Promise.all([
      db.site.count({ where: { userId } }),
      db.client.count({ where: { userId } }),
      db.incident.count({ where: { userId, status: { not: "RESOLVED" } } }),
      db.billing.count({ where: { userId, status: "OVERDUE" } }),
    ]);

  const activeSites = await db.site.count({ where: { userId, status: "ACTIVE" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your hosting portfolio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm">Sites</span>
          </div>
          <p className="text-2xl font-bold">{totalSites}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {activeSites} active
          </p>
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
          <p className={`text-2xl font-bold ${totalOpenIncidents > 0 ? "text-destructive" : ""}`}>
            {totalOpenIncidents}
          </p>
        </div>
        <div className="bg-background rounded-lg p-5 border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Overdue Bills</span>
          </div>
          <p className={`text-2xl font-bold ${totalOverdue > 0 ? "text-destructive" : ""}`}>
            {totalOverdue}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Sites */}
        <div className="bg-background rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Recent Sites</h3>
            <Link href="/sites" className="text-xs text-blue-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {sites.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No sites yet.{" "}
                <Link href="/sites" className="text-blue-500 hover:underline">
                  Add your first site
                </Link>
              </p>
            )}
            {sites.map((s) => (
              <Link
                key={s.id}
                href={`/sites/${s.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.platform}</p>
                </div>
                <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-background rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Open Incidents</h3>
            <Link href="/incidents" className="text-xs text-blue-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {openIncidents.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No open incidents.
              </p>
            )}
            {openIncidents.map((inc) => (
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
                <Badge variant={incidentStatusVariant[inc.status]}>{inc.status}</Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Billing */}
        <div className="bg-background rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Upcoming Billing (30 days)</h3>
            <Link href="/billing" className="text-xs text-blue-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {upcomingBillings.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No upcoming bills.
              </p>
            )}
            {upcomingBillings.map((b) => (
              <Link
                key={b.id}
                href={`/sites/${b.site.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{b.site.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {new Date(b.nextDueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {b.amount} {b.currency}
                  </span>
                  <Badge variant={billingStatusVariant[b.status]}>{b.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-background rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Recent Clients</h3>
            <Link href="/clients" className="text-xs text-blue-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {clients.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No clients yet.{" "}
                <Link href="/clients" className="text-blue-500 hover:underline">
                  Add your first client
                </Link>
              </p>
            )}
            {clients.map((c) => (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="flex items-center p-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">
                    {c.businessName ?? `${c.firstName} ${c.lastName}`}
                  </p>
                  {c.businessName && (
                    <p className="text-xs text-muted-foreground">
                      {c.firstName} {c.lastName}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
