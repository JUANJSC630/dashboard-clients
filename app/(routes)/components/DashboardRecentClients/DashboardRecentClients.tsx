import Link from "next/link";
import { db } from "@/lib/db";

export async function DashboardRecentClients({ userId }: { userId: string }) {
  const clients = await db.client.findMany({
    where: { userId },
    select: { id: true, firstName: true, lastName: true, businessName: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Recent Clients</h3>
        <Link
          href="/clients"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          View all
        </Link>
      </div>
      <div className="divide-y flex-1">
        {clients.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">No clients yet.</p>
            <Link
              href="/clients"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block font-medium"
            >
              Add your first client
            </Link>
          </div>
        ) : (
          clients.map((c) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm font-medium">
                  {c.businessName || `${c.firstName} ${c.lastName}`}
                </p>
                {c.businessName && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.firstName} {c.lastName}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
