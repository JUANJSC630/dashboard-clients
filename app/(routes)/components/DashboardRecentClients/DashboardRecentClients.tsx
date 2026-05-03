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
    <div className="bg-background rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Recent Clients</h3>
        <Link href="/clients" className="text-xs text-blue-500 hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {clients.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No clients yet.{" "}
            <Link href="/clients" className="text-blue-500 hover:underline">
              Add your first client
            </Link>
          </p>
        ) : (
          clients.map((c) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="flex items-center p-4 hover:bg-muted/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">
                  {c.businessName ?? `${c.firstName} ${c.lastName}`}
                </p>
                {c.businessName && (
                  <p className="text-xs text-muted-foreground">
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
