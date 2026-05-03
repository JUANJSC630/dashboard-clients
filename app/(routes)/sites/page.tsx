import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HeaderSites } from "./components/HeaderSites/HeaderSites";
import { ListSites } from "./components/ListSites/ListSites";

export default async function SitesPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const [sites, clients] = await Promise.all([
    db.site.findMany({
      where: { userId },
      include: {
        client: { select: { firstName: true, lastName: true, businessName: true } },
        incidents: { where: { status: { not: "RESOLVED" } }, select: { id: true } },
        billings: { select: { id: true, nextDueDate: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.client.findMany({
      where: { userId },
      select: { id: true, firstName: true, lastName: true, businessName: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  return (
    <div>
      <HeaderSites sites={sites} clients={clients} />
      <ListSites sites={sites} />
    </div>
  );
}
