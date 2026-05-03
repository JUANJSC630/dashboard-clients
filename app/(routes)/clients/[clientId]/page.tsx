import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ClientHeader } from "./components/ClientHeader";
import { ClientForm } from "./components/ClientForm/ClientForm";
import { ClientSites } from "./components/ClientSites/ClientSites";
import { FooterClient } from "./components/FooterClient/FooterClient";

export default async function ClientIdPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { userId } = await auth();
  const { clientId } = await params;

  if (!userId) return redirect("/");

  const client = await db.client.findUnique({
    where: { id: clientId, userId },
    include: {
      sites: {
        include: { billings: true, incidents: { where: { status: { not: "RESOLVED" } } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) return redirect("/clients");

  return (
    <div className="flex flex-col gap-6">
      <ClientHeader />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ClientForm client={client} />
        </div>
        <div>
          <FooterClient clientId={client.id} />
        </div>
      </div>
      <ClientSites sites={client.sites} />
    </div>
  );
}
