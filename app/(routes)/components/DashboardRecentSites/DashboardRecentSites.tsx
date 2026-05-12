import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { SiteStatus } from "@prisma/client";

const statusVariant: Record<
  SiteStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  DOWN: "destructive",
  MAINTENANCE: "outline",
};

export async function DashboardRecentSites({ userId }: { userId: string }) {
  const sites = await db.site.findMany({
    where: { userId },
    select: { id: true, name: true, status: true, platform: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Recent Sites</h3>
        <Link
          href="/sites"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          View all
        </Link>
      </div>
      <div className="divide-y flex-1">
        {sites.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">No sites yet.</p>
            <Link
              href="/sites"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block font-medium"
            >
              Add your first site
            </Link>
          </div>
        ) : (
          sites.map((s) => (
            <Link
              key={s.id}
              href={`/sites/${s.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.platform}
                </p>
              </div>
              <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export function DashboardSectionSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-background rounded-xl border animate-pulse">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="h-5 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
