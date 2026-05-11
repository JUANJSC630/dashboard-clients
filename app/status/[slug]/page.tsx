import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { StatusPageShell } from "./components/StatusPageShell";
import { OverallStatus } from "./components/OverallStatus";
import { ComponentList } from "./components/ComponentList";
import { UptimeBars } from "./components/UptimeBars";
import { ActiveIncidents } from "./components/ActiveIncidents";
import { ScheduledMaintenanceBanner } from "./components/ScheduledMaintenanceBanner";
import { PastIncidents } from "./components/PastIncidents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.statusPage.findUnique({
    where: { slug },
    select: { title: true, description: true, faviconUrl: true },
  });
  if (!page) return { title: "Status Page" };
  return {
    title: `${page.title} — Status`,
    description: page.description ?? `Current status for ${page.title}`,
    ...(page.faviconUrl ? { icons: { icon: page.faviconUrl } } : {}),
  };
}

export default async function PublicStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const statusPage = await db.statusPage.findUnique({
    where: { slug, isPublic: true },
    include: {
      components: { orderBy: { sortOrder: "asc" } },
      scheduledMaintenances: {
        where: {
          OR: [
            { status: "SCHEDULED", startsAt: { gt: new Date() } },
            { status: "IN_PROGRESS" },
          ],
        },
        orderBy: { startsAt: "asc" },
      },
    },
  });

  if (!statusPage) return notFound();

  // Fetch all sites referenced by the components
  const siteIds = statusPage.components.map((c) => c.siteId);

  const [sites, activeIncidents, recentIncidents] = await Promise.all([
    db.site.findMany({
      where: { id: { in: siteIds } },
      select: {
        id: true,
        name: true,
        url: true,
        status: true,
        uptimePercent: true,
        lastCheckedAt: true,
        sslExpiresAt: true,
        sslDaysLeft: true,
        pingLogs: {
          orderBy: { checkedAt: "desc" },
          take: 90,
          select: { isUp: true, latencyMs: true, checkedAt: true },
        },
      },
    }),
    // Active incidents on these sites
    db.incident.findMany({
      where: {
        siteId: { in: siteIds },
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      include: {
        updates: { orderBy: { createdAt: "desc" } },
        site: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    // Past 14 days of incidents
    db.incident.findMany({
      where: {
        siteId: { in: siteIds },
        status: "RESOLVED",
        createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
      include: {
        updates: { orderBy: { createdAt: "asc" } },
        site: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const siteMap = new Map(sites.map((s) => [s.id, s]));

  const components = statusPage.components.map((c) => ({
    ...c,
    site: siteMap.get(c.siteId) ?? null,
  }));

  // Calculate overall status
  const statuses = components.flatMap((c) =>
    c.site?.status ? [c.site.status] : [],
  );
  const overallStatus = statuses.includes("DOWN")
    ? "major_outage"
    : statuses.includes("MAINTENANCE")
      ? "maintenance"
      : statuses.some((s) => s === "PAUSED")
        ? "degraded"
        : "operational";

  return (
    <StatusPageShell
      title={statusPage.title}
      logoUrl={statusPage.logoUrl}
      brandColor={statusPage.brandColor}
      customCss={statusPage.customCss}
    >
      <OverallStatus status={overallStatus} />

      {statusPage.scheduledMaintenances.length > 0 && (
        <ScheduledMaintenanceBanner
          maintenances={statusPage.scheduledMaintenances}
        />
      )}

      {activeIncidents.length > 0 && (
        <ActiveIncidents incidents={activeIncidents} />
      )}

      <ComponentList components={components} />

      <UptimeBars components={components} />

      <PastIncidents incidents={recentIncidents} />
    </StatusPageShell>
  );
}
