import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SitesStatusChart } from "./components/SitesStatusChart";
import { IncidentsChart } from "./components/IncidentsChart";

export default async function PageAnalytics() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const [sites, incidents, billings] = await Promise.all([
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
    db.billing.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        amount: true,
        currency: true,
        nextDueDate: true,
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your hosting portfolio
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SitesStatusChart sites={sites} />
        <IncidentsChart incidents={incidents} />
      </div>
    </div>
  );
}
