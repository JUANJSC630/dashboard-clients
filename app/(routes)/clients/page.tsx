import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HeaderClients } from "./components/HeaderClients/HeaderClients";
import { ListClients } from "./components/ListClients/ListClients";
import { DataFilters } from "@/components/DataFilters";

export const metadata = {
  title: "Clients — Hosting Dashboard",
  description: "Manage your clients and their sites",
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { search } = await searchParams;

  const clients = await db.client.findMany({
    where: {
      userId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { businessName: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: { sites: { select: { id: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <HeaderClients clients={clients} />
      <div className="mb-4">
        <Suspense
          fallback={<div className="h-10 bg-muted rounded animate-pulse" />}
        >
          <DataFilters searchPlaceholder="Search by name or business..." />
        </Suspense>
      </div>
      <ListClients clients={clients} />
    </div>
  );
}
