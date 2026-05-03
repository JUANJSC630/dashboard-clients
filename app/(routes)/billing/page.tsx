import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { BillingStatus } from "@prisma/client";

const statusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const billings = await db.billing.findMany({
    where: { userId },
    include: {
      site: { select: { id: true, name: true } },
      client: { select: { id: true, firstName: true, lastName: true, businessName: true } },
    },
    orderBy: { nextDueDate: "asc" },
  });

  const overdue = billings.filter((b) => b.status === "OVERDUE");
  const pending = billings.filter((b) => b.status === "PENDING");
  const paid = billings.filter((b) => b.status === "PAID");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          All billing records across your sites
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-destructive">{overdue.length}</p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{paid.length}</p>
          <p className="text-sm text-muted-foreground">Paid</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Site</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Client</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Cycle</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Due Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {billings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No billing records yet. Add them from the site detail page.
                  </td>
                </tr>
              )}
              {billings.map((b) => {
                const isOverdue =
                  b.status === "PENDING" && new Date(b.nextDueDate) < new Date();
                return (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <Link
                        href={`/sites/${b.site.id}`}
                        className="font-medium hover:underline"
                      >
                        {b.site.name}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {b.client.businessName ??
                        `${b.client.firstName} ${b.client.lastName}`}
                    </td>
                    <td className="p-4 font-medium">
                      {b.amount} {b.currency}
                    </td>
                    <td className="p-4 text-muted-foreground">{b.cycle}</td>
                    <td
                      className={`p-4 ${isOverdue ? "text-destructive font-medium" : ""}`}
                    >
                      {new Date(b.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
