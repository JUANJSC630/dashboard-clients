import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SiteHeader } from "./components/SiteHeader";
import { SiteForm } from "./components/SiteForm/SiteForm";
import { SiteContacts } from "./components/SiteContacts/SiteContacts";
import { SiteBilling } from "./components/SiteBilling/SiteBilling";
import { SiteIncidents } from "./components/SiteIncidents/SiteIncidents";
import { SiteStatusHistory } from "./components/SiteStatusHistory/SiteStatusHistory";
import { SiteAlertConfig } from "./components/SiteAlertConfig/SiteAlertConfig";
import { FooterSite } from "./components/FooterSite/FooterSite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteId: string }>;
}): Promise<Metadata> {
  const { siteId } = await params;
  const site = await db.site.findUnique({
    where: { id: siteId },
    select: { name: true, url: true },
  });
  return {
    title: site ? `${site.name} — Sites` : "Site Detail",
    description: site?.url,
  };
}

export default async function SiteIdPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const [{ userId }, { siteId }] = await Promise.all([auth(), params]);

  if (!userId) return redirect("/");

  const [site, clients] = await Promise.all([
    db.site.findUnique({
      where: { id: siteId, userId },
      include: {
        client: true,
        contacts: { orderBy: { createdAt: "desc" } },
        billings: { orderBy: { nextDueDate: "asc" } },
        incidents: { orderBy: { createdAt: "desc" } },
        statusLogs: { orderBy: { changedAt: "desc" }, take: 20 },
        alertConfig: true,
      },
    }),
    db.client.findMany({
      where: { userId },
      select: { id: true, firstName: true, lastName: true, businessName: true },
    }),
  ]);

  if (!site) return redirect("/sites");

  return (
    <div className="flex flex-col gap-6">
      <SiteHeader site={site} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <SiteForm site={site} clients={clients} />
          <SiteIncidents incidents={site.incidents} siteId={site.id} />
          <SiteBilling
            billings={site.billings}
            siteId={site.id}
            clientId={site.clientId}
          />
        </div>
        <div className="flex flex-col gap-6">
          <SiteContacts contacts={site.contacts} siteId={site.id} />
          <SiteAlertConfig siteId={site.id} config={site.alertConfig} />
          <SiteStatusHistory logs={site.statusLogs} />
          <FooterSite siteId={site.id} />
        </div>
      </div>
    </div>
  );
}
