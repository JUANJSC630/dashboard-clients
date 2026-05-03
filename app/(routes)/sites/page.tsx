import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Platform, SiteStatus } from "@prisma/client";
import { HeaderSites } from "./components/HeaderSites/HeaderSites";
import { ListSites } from "./components/ListSites/ListSites";
import { DataFilters } from "@/components/DataFilters";

const SITE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "DOWN", label: "Down" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const PLATFORM_OPTIONS = [
  { value: "VERCEL", label: "Vercel" },
  { value: "RAILWAY", label: "Railway" },
  { value: "NETLIFY", label: "Netlify" },
  { value: "RENDER", label: "Render" },
  { value: "HOSTINGER", label: "Hostinger" },
  { value: "CLOUDFLARE", label: "Cloudflare" },
  { value: "HEROKU", label: "Heroku" },
  { value: "DIGITALOCEAN", label: "DigitalOcean" },
  { value: "CUSTOM", label: "Custom" },
];

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; platform?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { search, status, platform } = await searchParams;

  const [sites, clients] = await Promise.all([
    db.site.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { url: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && { status: status as SiteStatus }),
        ...(platform && { platform: platform as Platform }),
      },
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
      <div className="mb-4">
        <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse" />}>
          <DataFilters
            searchPlaceholder="Search by name or URL..."
            filters={[
              { key: "status", placeholder: "Status", options: SITE_STATUS_OPTIONS },
              { key: "platform", placeholder: "Platform", options: PLATFORM_OPTIONS },
            ]}
          />
        </Suspense>
      </div>
      <ListSites sites={sites} />
    </div>
  );
}
