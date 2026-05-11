import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { BillingStatus } from "@prisma/client";

const statusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

export async function DashboardUpcomingBilling({ userId }: { userId: string }) {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const billings = await db.billing.findMany({
    where: {
      userId,
      status: { not: "PAID" },
      nextDueDate: { lte: in30Days },
    },
    include: { site: { select: { id: true, name: true } } },
    orderBy: { nextDueDate: "asc" },
    take: 5,
  });

  return (
    <div className="bg-background rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Upcoming Billing (30 days)</h3>
        <Link href="/billing" className="text-xs text-blue-500 hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {billings.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No upcoming bills.
          </p>
        ) : (
          billings.map((b) => (
            <Link
              key={b.id}
              href={`/sites/${b.site.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{b.site.name}</p>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                  Due {new Date(b.nextDueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {b.amount} {b.currency}
                </span>
                <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
