import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SitesStatusChart } from "./components/SitesStatusChart";
import { IncidentsChart } from "./components/IncidentsChart";

export const metadata = {
  title: "Analytics — Hosting Dashboard",
  description: "Overview and insights for your hosting portfolio",
};

export default async function PageAnalytics() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const [sites, incidents] = await Promise.all([
    db.site.findMany({
      where: { userId },
      select: { id: true, status: true, platform: true, createdAt: true },
    }),
    db.incident.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        priority: true,
        type: true,
        createdAt: true,
      },
    }),
  ]);

  const totalSites = sites.length;
  const activeSites = sites.filter((s) => s.status === "ACTIVE").length;
  const healthRate =
    totalSites > 0 ? Math.round((activeSites / totalSites) * 100) : 0;
  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "RESOLVED",
  ).length;
  const resolutionRate =
    totalIncidents > 0
      ? Math.round((resolvedIncidents / totalIncidents) * 100)
      : 0;

  const summaryStats = [
    {
      label: "Total Sites",
      value: totalSites,
      sub: `${activeSites} active`,
      alert: false,
    },
    {
      label: "Site Health",
      value: `${healthRate}%`,
      sub: "currently active",
      alert: healthRate < 80 && totalSites > 0,
    },
    {
      label: "Total Incidents",
      value: totalIncidents,
      sub: "all time",
      alert: totalIncidents > 0,
    },
    {
      label: "Resolution Rate",
      value: `${resolutionRate}%`,
      sub: "resolved",
      alert: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-screen-xl mx-auto">
      <div className="pt-1">
        <h2 className="text-xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Insights for your hosting portfolio
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryStats.map(({ label, value, sub, alert }) => (
          <div key={label} className="bg-background rounded-xl p-5 border">
            <p className="text-xs font-medium text-muted-foreground mb-4">
              {label}
            </p>
            <p
              className={`text-3xl font-bold tracking-tight tabular-nums ${alert ? "text-destructive" : ""}`}
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SitesStatusChart sites={sites} />
        <IncidentsChart incidents={incidents} />
      </div>
    </div>
  );
}
