import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { BillingStatus } from "@prisma/client";
import { formatPrice } from "@/lib/formatPrice";

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
    <div className="bg-background rounded-xl border flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-sm font-semibold">Upcoming Billing</h3>
        <Link
          href="/billing"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          View all
        </Link>
      </div>
      <div className="divide-y flex-1">
        {billings.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming bills in the next 30 days.
            </p>
          </div>
        ) : (
          billings.map((b) => (
            <Link
              key={b.id}
              href={`/sites/${b.site.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{b.site.name}</p>
                <p
                  className="text-xs text-muted-foreground mt-0.5"
                  suppressHydrationWarning
                >
                  Due {new Date(b.nextDueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tabular-nums">
                  {formatPrice(b.amount, b.currency)}
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
