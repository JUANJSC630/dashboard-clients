import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  DashboardStats,
  DashboardStatsSkeleton,
} from "./components/DashboardStats/DashboardStats";
import {
  DashboardRecentSites,
  DashboardSectionSkeleton,
} from "./components/DashboardRecentSites/DashboardRecentSites";
import { DashboardOpenIncidents } from "./components/DashboardOpenIncidents/DashboardOpenIncidents";
import { DashboardUpcomingBilling } from "./components/DashboardUpcomingBilling/DashboardUpcomingBilling";
import { DashboardRecentClients } from "./components/DashboardRecentClients/DashboardRecentClients";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your hosting portfolio
        </p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats userId={userId} />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardSectionSkeleton title="Recent Sites" />}>
          <DashboardRecentSites userId={userId} />
        </Suspense>

        <Suspense fallback={<DashboardSectionSkeleton title="Open Incidents" />}>
          <DashboardOpenIncidents userId={userId} />
        </Suspense>

        <Suspense fallback={<DashboardSectionSkeleton title="Upcoming Billing" />}>
          <DashboardUpcomingBilling userId={userId} />
        </Suspense>

        <Suspense fallback={<DashboardSectionSkeleton title="Recent Clients" />}>
          <DashboardRecentClients userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

