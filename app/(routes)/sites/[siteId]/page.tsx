import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SiteHeader } from "./components/SiteHeader";
import { SiteForm } from "./components/SiteForm/SiteForm";
import { SiteContacts } from "./components/SiteContacts/SiteContacts";
import { SiteBilling } from "./components/SiteBilling/SiteBilling";
import { SiteIncidents } from "./components/SiteIncidents/SiteIncidents";
import { FooterSite } from "./components/FooterSite/FooterSite";

export default async function SiteIdPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { userId } = await auth();
  const { siteId } = await params;

  if (!userId) return redirect("/");

  const [site, clients] = await Promise.all([
    db.site.findUnique({
      where: { id: siteId, userId },
      include: {
        client: true,
        contacts: { orderBy: { createdAt: "desc" } },
        billings: { orderBy: { nextDueDate: "asc" } },
        incidents: { orderBy: { createdAt: "desc" } },
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
          <SiteBilling billings={site.billings} siteId={site.id} clientId={site.clientId} />
        </div>
        <div className="flex flex-col gap-6">
          <SiteContacts contacts={site.contacts} siteId={site.id} />
          <FooterSite siteId={site.id} />
        </div>
      </div>
    </div>
  );
}
