import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ClientHeader } from "./components/ClientHeader";
import { ClientForm } from "./components/ClientForm/ClientForm";
import { ClientSites } from "./components/ClientSites/ClientSites";
import { ClientBillingSummary } from "./components/ClientBillingSummary/ClientBillingSummary";
import { FooterClient } from "./components/FooterClient/FooterClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>;
}): Promise<Metadata> {
  const { clientId } = await params;
  const client = await db.client.findUnique({
    where: { id: clientId },
    select: { firstName: true, lastName: true, businessName: true },
  });
  const name =
    client?.businessName ??
    (client ? `${client.firstName} ${client.lastName}` : "Client");
  return { title: `${name} — Clients` };
}

export default async function ClientIdPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { userId } = await auth();
  const { clientId } = await params;

  if (!userId) return redirect("/");

  const [client, billings] = await Promise.all([
    db.client.findUnique({
      where: { id: clientId, userId },
      include: {
        sites: {
          include: {
            billings: true,
            incidents: { where: { status: { not: "RESOLVED" } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.billing.findMany({
      where: { clientId, userId },
      orderBy: { nextDueDate: "asc" },
    }),
  ]);

  if (!client) return redirect("/clients");

  return (
    <div className="flex flex-col gap-6">
      <ClientHeader />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ClientForm client={client} />
        </div>
        <div className="flex flex-col gap-6">
          <ClientBillingSummary billings={billings} />
          <FooterClient clientId={client.id} />
        </div>
      </div>
      <ClientSites sites={client.sites} />
    </div>
  );
}
