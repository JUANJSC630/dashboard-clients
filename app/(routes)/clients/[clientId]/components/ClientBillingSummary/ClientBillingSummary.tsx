import { Billing, BillingStatus, Currency } from "@prisma/client";
import { DollarSign, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

interface ClientBillingSummaryProps {
  billings: Billing[];
}

function sumByCurrency(records: Billing[]): string {
  const totals: Partial<Record<Currency, number>> = {};
  for (const b of records) {
    totals[b.currency] = (totals[b.currency] ?? 0) + b.amount;
  }
  return (
    Object.entries(totals)
      .map(([cur, amt]) => `${(amt as number).toFixed(2)} ${cur}`)
      .join(" · ") || "—"
  );
}

export function ClientBillingSummary({ billings }: ClientBillingSummaryProps) {
  const paid = billings.filter((b) => b.status === "PAID");
  const pending = billings.filter((b) => b.status === "PENDING");
  const overdue = billings.filter((b) => b.status === "OVERDUE");

  const upcoming = billings
    .filter((b) => b.status !== "PAID")
    .sort(
      (a, b) =>
        new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Billing Overview</h3>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 rounded-lg border">
          <p className="text-xl font-bold text-green-600">{paid.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Paid</p>
        </div>
        <div className="text-center p-3 rounded-lg border">
          <p className="text-xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
        </div>
        <div className="text-center p-3 rounded-lg border">
          <p className="text-xl font-bold text-destructive">{overdue.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Overdue</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="size-4 shrink-0" />
          <span>Total paid:</span>
          <span className="font-medium text-foreground">
            {sumByCurrency(paid)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4 shrink-0" />
          <span>Total pending:</span>
          <span className="font-medium text-foreground">
            {sumByCurrency(pending)}
          </span>
        </div>
        {overdue.length > 0 && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Total overdue:</span>
            <span className="font-medium">{sumByCurrency(overdue)}</span>
          </div>
        )}
      </div>

      {upcoming.length > 0 && (
        <>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Upcoming Due Dates
          </p>
          <div className="space-y-2">
            {upcoming.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground" suppressHydrationWarning>
                  {new Date(b.nextDueDate).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {b.amount} {b.currency}
                  </span>
                  <Badge variant={statusVariant[b.status]} className="text-xs">
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {billings.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No billing records for this client.
        </p>
      )}
    </div>
  );
}
